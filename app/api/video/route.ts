/** @format */

import * as fs from "fs";
import * as path from "path";

const CHUNK_SIZE_IN_BYTES = 5000000; // 5 MB
function getBaseVideoPath(videoId: string): string {
  const decodedVideoId = decodeURIComponent(videoId);

  const parts = decodedVideoId.split("/");
  const animeName = parts[0];

  const jsonPath = path.join(
    process.cwd(),
    "public",
    animeName,
    "anime",
    "path.json"
  );

  if (fs.existsSync(jsonPath)) {
    try {
      // Utilisation de trim() pour supprimer les espaces blancs inutiles
      const basePath = path.normalize(
        fs.readFileSync(jsonPath, "utf8").replace(/"/g, "").trim()
      );
      return basePath.endsWith("anime") ? basePath : path.join(basePath, "");
    } catch (error) {
      console.error("Error reading path.json:", error);
      return path.join(process.cwd(), "public", animeName);
    }
  } else {
    return path.join(process.cwd(), "public", animeName);
  }
}
function getVideoStream(req: Request): Response {
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
  const animeName = parts.shift() as string; // Retire le nom de l'anime du début
  const relativeVideoPath = parts.join("/");

  const baseVideoPath = getBaseVideoPath(animeName); // Passer le nom de l'anime à getBaseVideoPath

  let videoPath = path.normalize(path.join(baseVideoPath, relativeVideoPath)); // Utiliser le chemin relatif pour construire videoPath

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
