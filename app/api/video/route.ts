/** @format */

import { getAnimePathFromDb } from "@/app/types/db/item/getItemDb";
import * as fs from "fs";
import * as path from "path";

const CHUNK_SIZE_IN_BYTES = 5000000; // 5 MB

async function getBaseVideoPath(videoId: string): Promise<string> {
  const decodedVideoId = decodeURIComponent(videoId);
  const parts = decodedVideoId.split("/");
  const animeName = parts[0];

  try {
    let basePath = await getAnimePathFromDb(animeName);
    // Normaliser le chemin pour le système d'exploitation actuel
    basePath = path.normalize(basePath);
    return basePath;
  } catch (error) {
    console.error("Error retrieving base path from DB:", error);
    return path.join(__dirname, "videos");
  }
}

// Dans getVideoStream, ajustez la logique de construction de videoPath pour éviter la répétition

async function getVideoStream(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let videoId = url.searchParams.get("videoId");
  const range = req.headers.get("range");

  if (!videoId) {
    return new Response("No videoId query param", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  videoId = decodeURIComponent(videoId);

  const parts = videoId.split("/");
  const animeName = parts.shift() as string;
  const relativeVideoPath = parts.slice(1).join("/");
  const baseVideoPath = await getBaseVideoPath(animeName);

  let videoPath;
  const normalizedBaseVideoPath = path.normalize(baseVideoPath);

  videoPath = path.join(normalizedBaseVideoPath, relativeVideoPath);

  videoPath = path.normalize(videoPath);

  if (!fs.existsSync(videoPath)) {
    return new Response("Video not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const videoSizeInBytes = fs.statSync(videoPath).size;

  if (!range) {
    const headers = {
      "Content-Length": videoSizeInBytes.toString(),
      "Content-Type": "video/mp4",
    };

    const videoStream = fs.createReadStream(videoPath);
    return new Response(videoStream as any, { status: 200, headers });
  }

  const videoSize = fs.statSync(videoPath).size;
  const start = Number(range.replace(/bytes=/, "").split("-")[0]);
  const end = Math.min(start + CHUNK_SIZE_IN_BYTES, videoSize - 1);

  if (start >= videoSizeInBytes || end >= videoSizeInBytes) {
    return new Response("Range not satisfiable", {
      status: 416,
      statusText: "Range Not Satisfiable",
    });
  }

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSizeInBytes}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength.toString(),
    "Content-Type": "video/mp4",
  };

  const videoStream = fs.createReadStream(videoPath, { start, end });

  return new Response(videoStream as any, { status: 206, headers });
}

export async function GET(req: Request): Promise<Response> {
  return getVideoStream(req);
}
