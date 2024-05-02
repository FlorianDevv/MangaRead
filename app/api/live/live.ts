import * as fs from "fs/promises";
import * as mm from "music-metadata";
import * as path from "path";
import * as sqlite3 from "sqlite3";

const db = new sqlite3.Database("schedule.db");

db.run(`
  CREATE TABLE IF NOT EXISTS schedule (
    title TEXT,
    season INTEGER,
    episode INTEGER,
    start REAL,
    realStartTime INTEGER,
    startTime TEXT,
    duration REAL
  )
`);

function shuffleArray(array: any[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function getVideoDuration(filename: string): Promise<number> {
  const metadata = await mm.parseFile(filename);
  return metadata.format.duration || 0;
}

async function getVideoFiles(dir: string): Promise<string[]> {
  let entries = await fs.readdir(dir, { withFileTypes: true });

  let files: string[] = [];

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getVideoFiles(res));
    } else if (entry.isFile() && path.extname(res) === ".mp4") {
      files.push(res);
    }
  }

  return files;
}

export async function generateBroadcastSchedule(dir: string): Promise<void> {
  await fs.writeFile("launchTime.txt", Date.now().toString());
  let videoFiles = await getVideoFiles(dir);

  shuffleArray(videoFiles);

  let totalDuration = 0;
  let previousTitle = "";

  let currentTime = new Date();

  let videoIndex = 0;

  while (totalDuration < 7 * 24 * 60 * 60) {
    if (videoIndex >= videoFiles.length) {
      videoIndex = 0;
      shuffleArray(videoFiles);
    }

    const videoPath = videoFiles[videoIndex];
    if (!videoPath) {
      continue;
    }
    videoIndex++;

    try {
      const duration = await getVideoDuration(videoPath);
      totalDuration += duration;

      let startTime = new Date(currentTime.getTime() + totalDuration * 1000);

      const match = videoPath.match(
        /.*\\(.*)\\anime\\Season(\d+)\\(\d+)-(\d+)\.mp4$/
      );
      if (match) {
        const title = match[1];
        const season = Number(match[2]);
        const episode = Number(match[4].padStart(2, "0"));

        db.run(
          `
          INSERT INTO schedule (title, season, episode, start, realStartTime, startTime, duration)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [
            title,
            season,
            episode,
            totalDuration - duration,
            currentTime.getTime() + totalDuration * 1000,
            startTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            duration,
          ]
        );

        previousTitle = title;
      }
    } catch (ex) {
      console.error("Error:", ex);
    }
  }
}

generateBroadcastSchedule("public");
setInterval(() => generateBroadcastSchedule("public"), 60 * 60 * 1000);
