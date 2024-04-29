/**@format */

import * as fs from "fs";
import * as path from "path";

const CHUNK_SIZE_IN_BYTES = 1000000; // 1 mb

function* getVideoFiles(dir: string): IterableIterator<[string, string]> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* getVideoFiles(res);
    } else if (entry.isFile() && path.extname(res) === ".mp4") {
      yield [res, dir];
    }
  }
}

const videoFiles = Array.from(getVideoFiles("public"));

let currentDir: string | null = null;

function getVideoStream(req: Request) {
  const range = req.headers.get("range");

  if (!range) {
    // Add a default value for videoPath
    let videoPath: string | undefined = undefined;
    return new Response("No range header", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const videoFilesIterator = videoFiles[Symbol.iterator]();
  let videoPath: string | undefined, videoDir: string | undefined;
  do {
    const video = videoFilesIterator.next().value;
    if (!video) break;
    [videoPath, videoDir] = video;
  } while (videoDir === currentDir);

  currentDir = videoDir as string | null;

  if (!videoPath || !fs.existsSync(videoPath)) {
    return new Response("Video not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const videoSizeInBytes = fs.statSync(videoPath).size;

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1]
    ? parseInt(parts[1], 10)
    : Math.min(start + CHUNK_SIZE_IN_BYTES, videoSizeInBytes - 1);

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

    videoStream.on("end", () => {
      videoStream.destroy();
      do {
        const video = videoFilesIterator.next().value;
        if (!video) break;
        [videoPath, videoDir] = video;
      } while (videoDir === currentDir);

      currentDir = videoDir ?? null;
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
