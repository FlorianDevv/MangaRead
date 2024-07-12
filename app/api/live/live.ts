import { exec } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { promisify } from "node:util";
import { getAnimePathFromDb } from "@/app/types/db/item/getItemDb";
import { createScheduleTable } from "@/app/types/db/schedule/generateScheduleDb";
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

const execAsync = promisify(exec);

async function getVideoDuration(filename: string): Promise<number> {
	try {
		const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filename}"`;
		const { stdout } = await execAsync(command);
		const duration = Number.parseFloat(stdout.trim());
		return Number.isNaN(duration) ? 0 : duration;
	} catch (error) {
		console.error(`error when get duration video${filename}:`, error);
		return 0;
	}
}
async function getVideoFiles(dir: string): Promise<string[]> {
	// console.log(`Getting video files from directory: ${dir}`);
	const entries = await fs.readdir(dir, { withFileTypes: true });
	let files: string[] = [];

	for (const entry of entries) {
		const res = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files = files.concat(await getVideoFiles(res));
		} else if (entry.isFile() && path.extname(res) === ".mp4") {
			files.push(res);
		}
	}

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
	let totalDuration = 0;
	const animeTitles = await new Promise<string[]>((resolve, reject) => {
		dbItems.all("SELECT title FROM items", (err, rows: { title: string }[]) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows.map((row) => row.title));
			}
		});
	});

	const videoInfos: VideoInfo[] = [];

	for (const title of animeTitles) {
		let animePath = await getAnimePathFromDb(title);
		if (!animePath) {
			continue;
		}
		animePath += "/anime";
		const seasonDirs = await fs.readdir(animePath, { withFileTypes: true });
		if (seasonDirs.length === 0) {
		}
		for (const dir of seasonDirs) {
			if (dir.isDirectory() && dir.name.startsWith("Season")) {
				const seasonPath = path.join(animePath, dir.name);
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

export function startScheduledBroadcast() {
	// Planifier l'exécution de la fonction toutes les 12 heures
	setInterval(
		() => {
			console.log("Regenerating broadcast schedule...");
			generateBroadcastSchedule(true);
		},
		// 12 hours in milliseconds
		12 * 60 * 60 * 1000,
	);
}

startScheduledBroadcast();
