import fs from "node:fs";
import path from "node:path";
import { LRUCache } from "lru-cache";
import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "db/items.db");

async function openDb() {
	return open({
		filename: dbPath,
		driver: sqlite3.Database,
	});
}

const basePathCache = new LRUCache<string, string>({ max: 500 });

async function getBasePath(
	itemName: string,
	type: "manga" | "anime",
): Promise<string | null> {
	const cacheKey = `${itemName}:${type}`;
	if (basePathCache.has(cacheKey)) {
		const cachedValue = basePathCache.get(cacheKey);
		return cachedValue ?? null;
	}

	try {
		const db = await openDb();
		const query = "SELECT types_and_paths FROM items WHERE title = ?";
		const item = await db.get(query, [itemName]);

		if (item) {
			const pathsInfo = JSON.parse(item.types_and_paths);
			const pathInfo = pathsInfo.find((p: { type: string }) => p.type === type);
			const result = pathInfo ? pathInfo.path : null;
			basePathCache.set(cacheKey, result);
			return result;
		}
		basePathCache.set(cacheKey, undefined);
		return null;
	} catch (error) {
		console.error("Error in getBasePath:", error);
		return null;
	}
}

async function findCorrectVolumePath(
	basePath: string,
	volumePart: string,
): Promise<string> {
	const fullPath = path.join(basePath, volumePart);
	try {
		await fs.promises.access(fullPath);
		return fullPath;
	} catch (error) {
		const parentDir = path.dirname(fullPath);
		const files = await fs.promises.readdir(parentDir);
		const volumeNumber = volumePart.match(/\d+$/)?.[0];
		if (volumeNumber) {
			const regex = new RegExp(`(^|[^0-9])${volumeNumber}$`);
			const matchingFolder = files.find((file) => regex.test(file));
			if (matchingFolder) {
				return path.join(parentDir, matchingFolder);
			}
		}
		throw new Error(`Volume folder not found for ${volumePart}`);
	}
}

function nodeStreamToWebReadable(nodeStream: fs.ReadStream | sharp.Sharp) {
	if (nodeStream instanceof fs.ReadStream || nodeStream instanceof sharp) {
		return new ReadableStream({
			start(controller) {
				nodeStream.on("data", (chunk) => controller.enqueue(chunk));
				nodeStream.on("end", () => controller.close());
				nodeStream.on("error", (err) => controller.error(err));
			},
			cancel() {
				nodeStream.destroy();
			},
		});
	}
	throw new Error("Invalid stream type");
}

export async function GET(request: NextRequest) {
	const url = request.nextUrl;
	const imagePath = url.searchParams.get("path");
	const width = Number.parseInt(url.searchParams.get("w") || "0");
	const quality = Number.parseInt(url.searchParams.get("q") || "75");
	const isThumbnail = url.searchParams.get("type") === "thumbnail";

	if (!imagePath) {
		return new NextResponse(
			JSON.stringify({ error: "Missing required parameters" }),
			{
				status: 400,
			},
		);
	}

	const decodedImagePath = decodeURIComponent(imagePath);
	if (decodedImagePath.includes("..")) {
		return new NextResponse(JSON.stringify({ error: "Invalid image path" }), {
			status: 400,
		});
	}

	let fullPath: string;

	try {
		if (isThumbnail) {
			fullPath = path.join(process.cwd(), "videos", decodedImagePath);
		} else {
			const [itemName, type, volumePart, ...restOfPath] =
				decodedImagePath.split("/");
			const basePath = await getBasePath(itemName, type as "manga" | "anime");
			if (!basePath) {
				return new NextResponse(JSON.stringify({ error: "Image not found" }), {
					status: 404,
				});
			}
			const volumePath = await findCorrectVolumePath(
				path.join(basePath, type),
				volumePart,
			);
			fullPath = path.join(volumePath, ...restOfPath);
		}

		await fs.promises.access(fullPath);
	} catch (error) {
		return new NextResponse(JSON.stringify({ error: "File not found" }), {
			status: 404,
		});
	}

	try {
		const image = sharp(fullPath);
		if (width > 0) {
			image.resize(width);
		}
		const transformStream = image.webp({ quality }).toFormat("webp");
		const webReadableStream = nodeStreamToWebReadable(transformStream);

		return new NextResponse(webReadableStream, {
			headers: {
				"Content-Type": "image/webp",
				"Cache-Control": "public, max-age=604800, immutable",
			},
		});
	} catch (error) {
		console.error("Error in image processing:", error);
		return new NextResponse(
			JSON.stringify({ error: "An error occurred while processing the image" }),
			{
				status: 500,
			},
		);
	}
}
