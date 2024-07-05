import * as fs from "node:fs/promises";
import * as path from "node:path";
import { getAnimePathFromDb } from "@/app/types/db/item/getItemDb";
import { createScheduleTable } from "@/app/types/db/schedule/generateScheduleDb";
import * as mm from "music-metadata";
import * as sqlite3 from "sqlite3";

interface VideoInfo {
	videoPath: string;
	title: string;
	season: number;
	episode: number;
}

const dbSchedule = new sqlite3.Database(
	"db/schedule.db",
) as sqlite3.Database & { time: number };
const dbItems = new sqlite3.Database("db/items.db");

async function getVideoDuration(filename: string): Promise<number> {
	// console.log(`Getting video duration for file: ${filename}`);
	const metadata = await mm.parseFile(filename);
	return metadata.format.duration || 0;
}

async function getVideoFiles(dir: string): Promise<string[]> {
	// console.log(`Getting video files from directory: ${dir}`);
	const entries = await fs.readdir(dir, { withFileTypes: true });
	let files: string[] = [];

	for (const entry of entries) {
		const res = path.resolve(dir, entry.name);
		if (entry.isDirectory()) {
			console.log(`Found directory: ${res}, recursing into it.`);
			files = files.concat(await getVideoFiles(res));
		} else if (entry.isFile() && path.extname(res) === ".mp4") {
			console.log(`Found video file: ${res}`);
			files.push(res);
		}
	}

	console.log(`Found ${files.length} video files in directory: ${dir}`);
	return files;
}

function shuffleArray(array: VideoInfo[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
export async function generateBroadcastSchedule(
	addVideo = false,
): Promise<void> {
	console.log("Starting to generate broadcast schedule...");

	let totalDuration = 0;
	// const currentTime = new Date();

	console.log("Fetching anime titles from database...");
	const animeTitles = await new Promise<string[]>((resolve, reject) => {
		dbItems.all("SELECT title FROM items", (err, rows: { title: string }[]) => {
			if (err) {
				console.error("Error fetching titles from database:", err);
				reject(err);
			} else {
				console.log(`Fetched ${rows.length} titles.`);
				resolve(rows.map((row) => row.title));
			}
		});
	});

	const videoInfos: VideoInfo[] = [];

	for (const title of animeTitles) {
		console.log(`Processing title: ${title}`);
		let animePath = await getAnimePathFromDb(title);
		if (!animePath) {
			console.log(`No path found for ${title}`);
			continue;
		}
		animePath += "/anime";
		console.log(`Modified anime path for ${title}: ${animePath}`);
		const seasonDirs = await fs.readdir(animePath, { withFileTypes: true });
		if (seasonDirs.length === 0) {
			console.log(`No season directories found in ${animePath}`);
		}
		for (const dir of seasonDirs) {
			if (dir.isDirectory() && dir.name.startsWith("Season")) {
				const seasonPath = path.resolve(animePath, dir.name);
				const videoFiles = await getVideoFiles(seasonPath);
				for (const videoPath of videoFiles) {
					const match = videoPath.match(/Season(\d+)[\/\\](\d+)-(\d+)\.mp4$/);
					if (match) {
						const season = Number(match[1]);
						const episode = Number(match[3].padStart(2, "0"));
						videoInfos.push({ videoPath, title, season, episode });
					}
				}
			}
		}
	}

	// Sort videos by title, season, and episode
	videoInfos.sort((a, b) => {
		if (a && b && a.title !== b.title) {
			return a.title.localeCompare(b.title);
		}
		if (a && b && a.season !== b.season) {
			return a.season - b.season;
		}
		return a && b ? a.episode - b.episode : 0;
	});
	shuffleArray(videoInfos);

	createScheduleTable();
	dbSchedule.serialize(async () => {
		let lastRealStartTime = await new Promise<number>((resolve, reject) => {
			dbSchedule.get(
				"SELECT realStartTime, duration FROM schedule ORDER BY realStartTime DESC LIMIT 1",
				(err, row: { realStartTime: number; duration: number }) => {
					if (err) {
						reject(err);
					} else {
						resolve(row ? row.realStartTime + row.duration * 1000 : Date.now());
					}
				},
			);
		});
		dbSchedule.run("BEGIN TRANSACTION");
		// Calculate the total duration needed for 7 days in milliseconds
		const totalDurationNeeded = 604800;
		if (addVideo) {
			totalDuration = await new Promise<number>((resolve, reject) => {
				dbSchedule.get(
					`
SELECT SUM(duration) as totalDuration
FROM schedule
WHERE realStartTime >= ?
`,
					[Date.now()],
					(err, row: { totalDuration: number }) => {
						if (err) {
							console.error("Error:", err);
							reject(err);
						} else {
							resolve(row.totalDuration);
						}
					},
				);
			});
		}

		while (totalDuration < totalDurationNeeded) {
			for (const info of videoInfos) {
				if (info) {
					const { videoPath, title, season, episode } = info;
					try {
						const duration = await getVideoDuration(videoPath);

						if (duration === 0) {
							console.error("Error: Video duration is 0 for file:", videoPath);
							continue; // Skip this video and move on to the next one
						}
						const realStartTime = lastRealStartTime;
						const startTime = new Date(realStartTime); // Update startTime here

						await new Promise<void>((resolve, reject) => {
							dbSchedule.run(
								`
INSERT INTO schedule (title, season, episode, start, realStartTime, startTime, duration)
VALUES (?, ?, ?, ?, ?, ?, ?)
`,
								[
									title,
									season,
									episode,
									totalDuration,
									realStartTime,
									startTime.toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
										hour12: false,
									}),
									duration,
								],
								(err) => {
									if (err) {
										console.error("Error:", err);
										reject(err);
									} else {
										resolve();
									}
								},
							);
						});

						lastRealStartTime = realStartTime + duration * 1000;
						totalDuration += duration; // Update totalDuration after inserting the video
						// console.log("Total duration so far:", totalDuration);
						// If the total duration has reached 7 days, break out of the loop
						if (totalDuration >= totalDurationNeeded) {
							break;
						}
					} catch (err) {
						console.error("Error getting video duration:", err);
					}
				}
			}
		}
		dbSchedule.run("COMMIT", (err) => {
			if (err) {
				console.error("Error committing transaction:", err);
			} else {
				// Add this after the COMMIT statement
				dbSchedule.run(
					"CREATE TEMPORARY TABLE schedule_temp AS SELECT * FROM schedule ORDER BY start",
					(err) => {
						if (err) {
							console.error("Error creating temporary table:", err);
						} else {
							dbSchedule.run("DELETE FROM schedule", (err) => {
								if (err) {
									console.error("Error deleting from schedule table:", err);
								} else {
									dbSchedule.run(
										"INSERT INTO schedule SELECT * FROM schedule_temp",
										(err) => {
											if (err) {
												console.error(
													"Error inserting into schedule table:",
													err,
												);
											} else {
												dbSchedule.run("DROP TABLE schedule_temp", (err) => {
													if (err) {
														console.error(
															"Error dropping temporary table:",
															err,
														);
													}
												});
											}
										},
									);
								}
							});
						}
					},
				);
			}
		});
	});
}

// // Assuming dbSchedule is properly initialized and imported from elsewhere
// export async function getLaunchTime(): Promise<number> {
// 	try {
// 		const result = await dbSchedule.get<{ time: number }>(
// 			"SELECT time FROM launch_time WHERE id = 1",
// 		);
// 		return result ? result.time : Date.now();
// 	} catch (error) {
// 		console.error("Error accessing the database:", error);
// 		return Date.now(); // Fallback to current time on error
// 	}
// }

export function startScheduledBroadcast() {
	// Planifier l'exécution de la fonction toutes les 12 heures
	setInterval(
		() => {
			console.log("Regenerating broadcast schedule...");
			generateBroadcastSchedule(true);
		},
		12 * 60 * 60 * 1000,
	);
}

startScheduledBroadcast();
