/**@format */

import * as fs from "fs";

const CHUNK_SIZE_IN_BYTES = 5000000; // 5 mb

function getVideoStream(req: Request) {
  const range = req.headers.get("range");

  const url = new URL(req.url);
  const videoId = url.searchParams.get("videoId");
  const videoPath = `public/${videoId}`;
  const videoSizeInBytes = fs.statSync(videoPath).size;
  if (!range) {
    const headers = {
      "Content-Length": videoSizeInBytes.toString(),
      "Content-Type": "video/mp4",
    } as { [key: string]: string };

    const videoStream = fs.createReadStream(videoPath);
    return new Response(videoStream as any, { status: 200, headers });
  }

  if (!videoId) {
    return new Response("No videoId query param", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  if (!fs.existsSync(videoPath)) {
    return new Response("Video not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  if (start >= videoSizeInBytes) {
    return new Response("Range not satisfiable", {
      status: 416,
      statusText: "Range Not Satisfiable",
    });
  }
  const end = parts[1]
    ? parseInt(parts[1], 10)
    : start === 0
    ? 1
    : Math.min(start + CHUNK_SIZE_IN_BYTES - 1, videoSizeInBytes - 1);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSizeInBytes}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength.toString(),
    "Content-Type": "video/mp4",
  } as { [key: string]: string };

  try {
    const videoStream = fs.createReadStream(videoPath, {
      start: start,
      end: end,
    });

    return new Response(videoStream as any, { status: 206, headers });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ERR_INVALID_STATE") {
      console.error("Stream was closed before it could be read");
      // Handle the error here, e.g. by retrying the operation or showing an error message
    } else {
      throw err;
    }
  }

  return new Response(getVideoStream as any, { status: 206, headers });
}

export async function GET(req: Request) {
  return getVideoStream(req);
}
