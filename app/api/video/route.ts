/**@format */

import * as fs from "fs";

const CHUNK_SIZE_IN_BYTES = 1000000; // 1 mb

function getVideoStream(req: Request) {
  const range = req.headers.get("range");

  if (!range) {
    return new Response("No range header", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  const url = new URL(req.url);
  const videoId = url.searchParams.get("videoId");

  if (!videoId) {
    return new Response("No videoId query param", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const videoPath = `public/${videoId}.mp4`;

  const videoSizeInBytes = fs.statSync(videoPath).size;

  const chunkStart = Number(range.replace(/\D/g, ""));

  const chunkEnd = Math.min(
    chunkStart + CHUNK_SIZE_IN_BYTES,
    videoSizeInBytes - 1
  );

  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength.toString(),
    "Content-Type": "video/mp4",
  } as { [key: string]: string };

  const videoStream = fs.createReadStream(videoPath, {
    start: chunkStart,
    end: chunkEnd,
  });

  return new Response(videoStream as any, { status: 206, headers });
}

export async function GET(req: Request) {
  return getVideoStream(req);
}
