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

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export async function generateBroadcastSchedule(
  dir: string,
  resetDB: boolean = false
): Promise<void> {
  await fs.writeFile("launchTime.txt", Date.now().toString());

  let totalDuration = 0;
  let currentTime = new Date();

  let videoFiles = await getVideoFiles(dir);
  shuffleArray(videoFiles);

  db.serialize(async () => {
    if (resetDB) {
      // Drop the schedule table if it exists and create a new one
      db.run("DROP TABLE IF EXISTS schedule", (err) => {
        if (err) {
          console.error("Error dropping old schedule table:", err);
        }
      });

      db.run(
        `
        CREATE TABLE IF NOT EXISTS schedule (
          title TEXT,
          season INTEGER,
          episode INTEGER,
          start REAL,
          realStartTime REAL,
          startTime TEXT,
          duration REAL
        )
      `,
        (err) => {
          if (err) {
            console.error("Error creating new schedule table:", err);
          }
        }
      );
    }

    let lastRealStartTime = Date.now(); // Initialize with the current time

    db.run("BEGIN TRANSACTION");

    for (const videoPath of videoFiles) {
      try {
        const duration = await getVideoDuration(videoPath);
        let realStartTime = lastRealStartTime;
        let startTime = new Date(realStartTime); // Update startTime here

        // Stop adding videos if the start time is more than 7 days from now
        if (startTime > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
          break;
        }

        const match = videoPath.match(
          /.*[\/\\](.*)[\/\\]anime[\/\\]Season(\d+)[\/\\](\d+)-(\d+)\.mp4$/
        );
        if (match) {
          const title = match[1];
          const season = Number(match[2]);
          const episode = Number(match[4].padStart(2, "0"));

          await new Promise<void>((resolve, reject) => {
            db.run(
              `
        INSERT INTO schedule (title, season, episode, start, realStartTime, startTime, duration)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
              [
                title,
                season,
                episode,
                totalDuration,
                realStartTime,
                startTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }),
                duration,
              ],
              (err) => {
                if (err) {
                  console.error("Error:", err);
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          });

          lastRealStartTime = realStartTime + duration * 1000; // Update lastRealStartTime after inserting the video
          totalDuration += duration; // Update totalDuration after inserting the video
        } else {
          console.error("Error: Could not match video path:", videoPath);
        }
      } catch (ex) {
        console.error("Error:", ex);
      }
    }

    db.run("COMMIT", (err) => {
      if (err) {
        console.error("Error committing transaction:", err);
      }
    });
  });
}

generateBroadcastSchedule("public", true);
setInterval(() => generateBroadcastSchedule("public"), 60 * 60 * 1000);
