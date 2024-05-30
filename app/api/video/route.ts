/** @format */

import * as fs from "fs";
import * as path from "path";

const CHUNK_SIZE_IN_BYTES = 5000000; // 5 MB

function getVideoStream(req: Request): Response {
  const range = req.headers.get("range");

  const url = new URL(req.url);
  let videoId = url.searchParams.get("videoId");

  if (!videoId) {
    return new Response("No videoId query param", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  videoId = decodeURIComponent(videoId);
  const videoPath = path.join("public", videoId);

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

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1]
    ? parseInt(parts[1], 10)
    : Math.min(start + CHUNK_SIZE_IN_BYTES - 1, videoSizeInBytes - 1);

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
