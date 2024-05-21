import * as fs from "fs/promises";
import * as mm from "music-metadata";
import * as path from "path";
import * as sqlite3 from "sqlite3";

const db = new sqlite3.Database("schedule.db");
fs.writeFile("launchTime.txt", Date.now().toString());
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
  addVideo: boolean = false
): Promise<void> {
  fs.writeFile("launchTime.txt", Date.now().toString());

  let totalDuration = 0;
  let currentTime = new Date();

  let videoFiles = await getVideoFiles(dir);
  shuffleArray(videoFiles);
  let videoInfos = videoFiles
    .map((videoPath) => {
      const match = videoPath.match(
        /.*[\/\\](.*)[\/\\]anime[\/\\]Season(\d+)[\/\\](\d+)-(\d+)\.mp4$/
      );
      if (match) {
        const title = match[1];
        const season = Number(match[2]);
        const episode = Number(match[4].padStart(2, "0"));
        return { videoPath, title, season, episode };
      } else {
        console.error("Error: Could not match video path:", videoPath);
        return null;
      }
    })
    .filter((info) => info !== null); // Remove null values

  // Sort videos by title, season, and episode
  videoInfos.sort((a, b) => {
    if (a && b && a.title !== b.title) {
      return a.title.localeCompare(b.title);
    } else if (a && b && a.season !== b.season) {
      return a.season - b.season;
    } else {
      return a && b ? a.episode - b.episode : 0;
    }
  });
  shuffleArray(videoInfos);

  db.serialize(async () => {
    let lastRealStartTime = await new Promise<number>((resolve, reject) => {
      db.get(
        "SELECT realStartTime, duration FROM schedule ORDER BY realStartTime DESC LIMIT 1",
        (err, row: { realStartTime: number; duration: number }) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? row.realStartTime + row.duration * 1000 : Date.now());
          }
        }
      );
    });
    db.run("BEGIN TRANSACTION");
    // Calculate the total duration needed for 7 days in milliseconds
    const totalDurationNeeded = 604800;
    if (addVideo) {
      totalDuration = await new Promise<number>((resolve, reject) => {
        db.get(
          `
SELECT SUM(duration) as totalDuration
FROM schedule
WHERE realStartTime >= ?
`,
          [Date.now()],
          (err, row: { totalDuration: number }) => {
            if (err) {
              console.error("Error:", err);
              reject(err);
            } else {
              resolve(row.totalDuration);
            }
          }
        );
      });
    }

    while (totalDuration < totalDurationNeeded) {
      for (const info of videoInfos) {
        if (info) {
          const { videoPath, title, season, episode } = info;
          try {
            const duration = await getVideoDuration(videoPath);
            if (duration === 0) {
              console.error("Error: Video duration is 0 for file:", videoPath);
              continue; // Skip this video and move on to the next one
            }
            let realStartTime = lastRealStartTime;
            let startTime = new Date(realStartTime); // Update startTime here

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

            lastRealStartTime = realStartTime + duration * 1000;
            totalDuration += duration; // Update totalDuration after inserting the video
            // console.log("Total duration so far:", totalDuration);
            // If the total duration has reached 7 days, break out of the loop
            if (totalDuration >= totalDurationNeeded) {
              break;
            }
          } catch (err) {
            console.error("Error getting video duration:", err);
          }
        }
      }
    }
    db.run("COMMIT", (err) => {
      if (err) {
        console.error("Error committing transaction:", err);
      } else {
        // Add this after the COMMIT statement
        db.run(
          "CREATE TEMPORARY TABLE schedule_temp AS SELECT * FROM schedule ORDER BY start",
          (err) => {
            if (err) {
              console.error("Error creating temporary table:", err);
            } else {
              db.run("DELETE FROM schedule", (err) => {
                if (err) {
                  console.error("Error deleting from schedule table:", err);
                } else {
                  db.run(
                    "INSERT INTO schedule SELECT * FROM schedule_temp",
                    (err) => {
                      if (err) {
                        console.error(
                          "Error inserting into schedule table:",
                          err
                        );
                      } else {
                        db.run("DROP TABLE schedule_temp", (err) => {
                          if (err) {
                            console.error(
                              "Error dropping temporary table:",
                              err
                            );
                          }
                        });
                      }
                    }
                  );
                }
              });
            }
          }
        );
      }
    });
  });
}
export function startScheduledBroadcast() {
  // Planifier l'exécution de la fonction toutes les 12 heures
  setInterval(() => {
    console.log("Regenerating broadcast schedule...");
    generateBroadcastSchedule("public", true);
  }, 12 * 60 * 60 * 1000);
}
startScheduledBroadcast();
