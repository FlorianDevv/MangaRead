import * as fs from "node:fs";
import * as path from "node:path";
import { getAnimePathFromDb } from "@/app/types/db/item/getItemDb";

let CHUNK_SIZE_IN_BYTES = 5000000; // 5 MB
const DEFAULT_VIDEO_FOLDER = "videos";
const VIDEO_CONTENT_TYPE = "video/mp4";

async function getBaseVideoPath(videoId: string): Promise<string> {
	try {
		const animeName = decodeURIComponent(videoId).split("/")[0];
		const basePath = await getAnimePathFromDb(animeName);
		return path.normalize(basePath);
	} catch (error) {
		console.error("Error retrieving base path from DB:", error);
		return path.join(__dirname, DEFAULT_VIDEO_FOLDER);
	}
}

async function getVideoStream(req: Request): Promise<Response> {
	const url = new URL(req.url);
	const videoId = url.searchParams.get("videoId");
	const type = url.searchParams.get("type");
	const range = req.headers.get("range");

	if (!videoId) {
		return new Response("No videoId query param", {
			status: 400,
			statusText: "Bad Request",
		});
	}

	let videoPath: string;
	const headers: { [key: string]: string } = {
		"Content-Type": VIDEO_CONTENT_TYPE,
	};

	if (type === "preview") {
		CHUNK_SIZE_IN_BYTES = 1000000; // 1 MB
		const [itemName] = decodeURIComponent(videoId).split("/");
		videoPath = path.join(
			process.cwd(),
			`videos/${itemName}`,
			"/anime/",
			"preview.mp4",
		);
		headers["Cache-Control"] = "public, max-age=604800, immutable";
	} else {
		const [animeName, ...relativeVideoParts] =
			decodeURIComponent(videoId).split("/");
		videoPath = path.join(
			await getBaseVideoPath(animeName),
			...relativeVideoParts,
		);
	}

	if (!fs.existsSync(videoPath)) {
		console.error("Video not found:", videoPath);
		return new Response("Video not found", {
			status: 404,
			statusText: "Not Found",
		});
	}

	const videoSize = fs.statSync(videoPath).size;
	if (!range) {
		const stream = fs.createReadStream(videoPath);
		const readableStream = new ReadableStream({
			start(controller) {
				stream.on("data", (chunk) => {
					controller.enqueue(new Uint8Array(Buffer.from(chunk).buffer));
				});
				stream.on("end", () => {
					controller.close();
				});
				stream.on("error", (err) => {
					console.error("Stream error:", err);
					controller.error(err);
				});
			},
		});
		headers["Content-Length"] = videoSize.toString();
		return new Response(readableStream, {
			status: 200,
			headers: headers,
		});
	}
	const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
	const start = Number(startStr);
	const end = endStr
		? Math.min(Number(endStr), videoSize - 1)
		: Math.min(start + CHUNK_SIZE_IN_BYTES - 1, videoSize - 1);

	if (start >= videoSize || end >= videoSize) {
		return new Response("Range not satisfiable", {
			status: 416,
			statusText: "Range Not Satisfiable",
		});
	}

	const stream = fs.createReadStream(videoPath, { start, end });
	const readableStream = new ReadableStream({
		start(controller) {
			stream.on("data", (chunk) => {
				controller.enqueue(new Uint8Array(Buffer.from(chunk).buffer));
			});
			stream.on("end", () => {
				controller.close();
			});
			stream.on("error", (err) => {
				console.error("Stream error:", err);
				controller.error(err);
			});
		},
	});

	headers["Content-Range"] = `bytes ${start}-${end}/${videoSize}`;
	headers["Accept-Ranges"] = "bytes";
	headers["Content-Length"] = (end - start + 1).toString();

	return new Response(readableStream, {
		status: 206,
		headers: headers,
	});
}

export async function GET(req: Request): Promise<Response> {
	return getVideoStream(req);
}
