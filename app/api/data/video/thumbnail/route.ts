import fs from "node:fs";
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const dbPath = path.resolve(process.cwd(), "db/items.db");

async function openDb() {
	return open({
		filename: dbPath,
		driver: sqlite3.Database,
	});
}

async function getAllVideoPaths(): Promise<
	Array<{ itemName: string; videoDir: string }>
> {
	const db = await openDb();
	const query = "SELECT title, types_and_paths FROM items";
	const items = await db.all(query);

	return items.flatMap((item) => {
		const pathsInfo = JSON.parse(item.types_and_paths);
		const pathInfo = pathsInfo.find(
			(p: { type: string }) => p.type === "anime",
		);
		if (pathInfo) {
			return [
				{
					itemName: item.title,
					videoDir: `${pathInfo.path}/anime`,
				},
			];
		}
		return [];
	});
}

function generateThumbnail(filePath: string, outputFilePath: string) {
	return new Promise<void>((resolve, reject) => {
		ffmpeg.ffprobe(filePath, (err, metadata) => {
			if (err) {
				console.error("Error during ffprobe:", err);
				reject(err);
				return;
			}

			const { width, height } = metadata.streams[0] as {
				width: number;
				height: number;
			};
			const aspectRatio = width / height;

			let size: string;
			if (aspectRatio > 16 / 9) {
				size = "1920x?";
			} else if (aspectRatio < 16 / 9) {
				size = "?x1080";
			} else {
				size = "1920x1080";
			}

			ffmpeg(filePath)
				.screenshots({
					timestamps: ["15%"],
					filename: path.basename(outputFilePath),
					folder: path.dirname(outputFilePath),
					size: size,
				})
				.on("error", (err) => {
					console.error(`Error generating thumbnail: ${err.message}`);
					reject(err);
				})
				.on("end", () => {
					resolve();
				});
		});
	});
}

function getAllVideoFiles(dir: string): string[] {
	let results: string[] = [];
	const list = fs.readdirSync(dir);
	for (const file of list) {
		const filePath = path.resolve(dir, file);
		const stat = fs.statSync(filePath);
		if (stat?.isDirectory()) {
			results = results.concat(getAllVideoFiles(filePath));
		} else if (path.extname(filePath).toLowerCase() === ".mp4") {
			results.push(filePath);
		}
	}
	return results;
}

async function generateThumbnails() {
	const itemsPaths = await getAllVideoPaths();
	const videosDirectoryPath = path.resolve(process.cwd(), "videos");

	if (!fs.existsSync(videosDirectoryPath)) {
		fs.mkdirSync(videosDirectoryPath, { recursive: true });
	}

	for (const { itemName, videoDir } of itemsPaths) {
		const itemThumbnailDir = path.resolve(
			videosDirectoryPath,
			itemName,
			"/anime",
		);
		if (!fs.existsSync(itemThumbnailDir)) {
			fs.mkdirSync(itemThumbnailDir, { recursive: true });
		}

		const videoFiles = getAllVideoFiles(videoDir);

		for (const videoFile of videoFiles) {
			const relativePath = path.relative(videoDir, videoFile);
			const thumbnailPath = path.resolve(
				itemThumbnailDir,
				relativePath.replace(".mp4", ".webp"),
			);

			const thumbnailDir = path.dirname(thumbnailPath);
			if (!fs.existsSync(thumbnailDir)) {
				fs.mkdirSync(thumbnailDir, { recursive: true });
			}

			if (!fs.existsSync(thumbnailPath)) {
				try {
					await generateThumbnail(videoFile, thumbnailPath);
					console.log(`Generated thumbnail for ${relativePath}`);
				} catch (error) {
					console.error(
						`Failed to generate thumbnail for ${relativePath}:`,
						error,
					);
				}
			}
		}
	}
}

// Fonction de gestion de la requête POST

export async function POST(): Promise<Response> {
	await generateThumbnails();
	return new Response(
		JSON.stringify({ message: "Thumbnail generation completed." }),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
}

generateThumbnails();
