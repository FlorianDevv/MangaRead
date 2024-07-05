import fs, { promises as fsPromises } from "node:fs";
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
	Array<{ itemName: string; videoPath: string }>
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
					videoPath: `${pathInfo.path}/anime/Season01/01-001.mp4`,
				},
			];
		}
		return [];
	});
}

async function getVideoPath(itemName: string): Promise<string | null> {
	const db = await openDb();
	const query = "SELECT types_and_paths FROM items WHERE title = ?";
	const item = await db.get(query, [itemName]);

	if (item) {
		const pathsInfo = JSON.parse(item.types_and_paths);
		const pathInfo = pathsInfo.find(
			(p: { type: string }) => p.type === "anime",
		);
		return pathInfo ? `${pathInfo.path}/anime/Season01/01-001.mp4` : null;
	}
	return null;
}

async function generatePreviewsForAllItems() {
	const itemsPaths = await getAllVideoPaths();
	const videosDirectoryPath = path.resolve(process.cwd(), "videos");

	if (!fs.existsSync(videosDirectoryPath)) {
		fs.mkdirSync(videosDirectoryPath);
	}

	for (const { itemName, videoPath } of itemsPaths) {
		const itemPreviewPath = path.resolve(
			videosDirectoryPath,
			itemName,
			"/anime",
		);
		if (!fs.existsSync(itemPreviewPath)) {
			fs.mkdirSync(itemPreviewPath);
		}
		generatePreview(videoPath, itemPreviewPath);
	}
}

function generatePreview(filePath: string, outputDirectoryPath: string) {
	const outputFilePath = path.resolve(outputDirectoryPath, "preview.mp4");

	if (!fs.existsSync(outputFilePath)) {
		ffmpeg.ffprobe(filePath, (err, metadata) => {
			if (err) {
				console.error("Error during ffprobe:", err);
				return;
			}

			const duration = metadata.format.duration as number;
			const seekTime = duration * 0.15;

			ffmpeg(filePath)
				.seekInput(seekTime)
				.duration(60)
				.outputOptions(["-crf 26", "-preset veryslow"])
				.output(outputFilePath)
				.on("error", (err) => {
					console.error("Error during ffmpeg processing:", err);
				})
				.run();
		});
	}
}

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const itemName = searchParams.get("item");

	if (!itemName) {
		await generatePreviewsForAllItems();
		return Response.json({
			message: "Preview generation started for all items.",
		});
	}

	const videoPath = await getVideoPath(itemName);

	if (!videoPath) {
		return Response.json(
			{ error: "Video path not found for the item" },
			{ status: 404 },
		);
	}

	const videosDirectoryPath = path.resolve(process.cwd(), "videos");
	if (!fs.existsSync(videosDirectoryPath)) {
		fs.mkdirSync(videosDirectoryPath);
	}

	const itemPreviewPath = path.resolve(videosDirectoryPath, itemName);
	if (!fs.existsSync(itemPreviewPath)) {
		fs.mkdirSync(itemPreviewPath);
	}

	generatePreview(videoPath, itemPreviewPath);

	return Response.json({
		message: `Preview generation started for ${itemName}`,
		previewPath: path.resolve("/videos", itemName, "preview.mp4"),
	});
}
