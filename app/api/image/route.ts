import fs from "node:fs/promises";
import path from "node:path";
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

async function getBasePath(
	itemName: string,
	type: "manga" | "anime",
): Promise<string | null> {
	const db = await openDb();
	const query = "SELECT types_and_paths FROM items WHERE title = ?";
	const item = await db.get(query, [itemName]);

	if (item) {
		const pathsInfo = JSON.parse(item.types_and_paths);
		const pathInfo = pathsInfo.find((p: { type: string }) => p.type === type);
		return pathInfo ? pathInfo.path : null;
	}
	return null;
}

async function findCorrectVolumePath(
	basePath: string,
	volumePart: string,
): Promise<string> {
	const fullPath = path.join(basePath, volumePart);
	try {
		await fs.access(fullPath);
		return fullPath;
	} catch (error) {
		const parentDir = path.dirname(fullPath);
		const files = await fs.readdir(parentDir);
		const volumeNumber = volumePart.match(/\d+$/)?.[0];
		if (volumeNumber) {
			const regex = new RegExp(`(^|[^0-9])${volumeNumber}$`);
			const matchingFolder = files.find((file) => {
				const match = file.match(regex);
				return match !== null;
			});
			if (matchingFolder) {
				return path.join(parentDir, matchingFolder);
			}
		}
		throw new Error(`Volume folder not found for ${volumePart}`);
	}
}

export async function GET(request: NextRequest) {
	const url = request.nextUrl;
	const imagePath = url.searchParams.get("path");
	const width = Number.parseInt(url.searchParams.get("w") || "0");
	const quality = Number.parseInt(url.searchParams.get("q") || "75");
	const isThumbnail = url.searchParams.get("type") === "thumbnail";

	try {
		if (!imagePath) {
			throw new Error("Missing required parameters");
		}

		const decodedImagePath = decodeURIComponent(imagePath);
		if (decodedImagePath.includes("..")) {
			throw new Error("Invalid image path");
		}

		let basePath: string | null;
		let fullPath: string | null;

		if (isThumbnail) {
			basePath = path.join(process.cwd(), "videos");
			fullPath = path.join(basePath, decodedImagePath);
		} else {
			const pathParts = decodedImagePath.split("/");
			const itemName = pathParts[0];
			const type = pathParts[1] as "manga" | "anime";
			basePath = await getBasePath(itemName, type);

			if (!basePath) {
				return;
			}

			const volumePart = pathParts[2];
			const restOfPath = pathParts.slice(3).join("/");

			const volumePath = await findCorrectVolumePath(
				path.join(basePath, type),
				volumePart,
			);
			fullPath = path.join(volumePath, restOfPath);
		}

		const image = sharp(fullPath);
		if (width > 0) {
			image.resize(width);
		}
		const buffer = await image.webp({ quality }).toBuffer();

		return new NextResponse(buffer, {
			headers: {
				"Content-Type": "image/webp",
				"Cache-Control": "public, max-age=604800, immutable",
			},
		});
	} catch (error) {
		console.error("Error processing image:", error);
		return new NextResponse(
			JSON.stringify({ error: (error as Error).message }),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
