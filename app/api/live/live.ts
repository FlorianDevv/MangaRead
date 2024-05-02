import * as fs from "fs";
import * as mm from "music-metadata";
import * as path from "path";

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

function* getVideoFiles(dir: string): Generator<string> {
  let entries = fs.readdirSync(dir, { withFileTypes: true });

  // Shuffle the entries array to get a random order
  shuffleArray(entries);

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* getVideoFiles(res);
    } else if (entry.isFile() && path.extname(res) === ".mp4") {
      yield res;
    }
  }
}

export let schedule: any[] = [];

export async function generateBroadcastSchedule(dir: string): Promise<any[]> {
  fs.writeFileSync("launchTime.txt", Date.now().toString());
  let videoFiles = Array.from(getVideoFiles(dir));

  let totalDuration = 0;
  let previousTitle = "";

  // Get the current time
  let currentTime = new Date();

  let videoIndex = 0;

  while (totalDuration < 7 * 24 * 60 * 60) {
    // 1 hours in seconds
    // 7 days in seconds
    // If we've reached the end of the videoFiles array, start over
    if (videoIndex >= videoFiles.length) {
      videoIndex = 0;
      shuffleArray(videoFiles); // Shuffle the array to get a new random order
    }

    const videoPath = videoFiles[videoIndex];
    videoIndex++;

    let fd = fs.openSync(videoPath, "r");
    try {
      const duration = await getVideoDuration(videoPath);
      totalDuration += duration;

      // Calculate the start time of the episode
      let startTime = new Date(currentTime.getTime() + totalDuration * 1000);

      // Extract title, episode, and season from the video path
      const match = videoPath.match(
        /.*\\(.*)\\anime\\Season(\d+)\\(\d+)-(\d+)\.mp4$/
      );
      if (match) {
        const title = match[1];
        const season = Number(match[2]);
        const episode = Number(match[4].padStart(2, "0"));

        schedule.push({
          title,
          season,
          episode,
          start: totalDuration - duration,
          realStartTime: currentTime.getTime() + totalDuration * 1000, // Store the real start time
          startTime: startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          duration,
        });
        previousTitle = title; // Update the previous title
      }
    } catch (ex) {
      console.error("Error:", ex);
    } finally {
      fs.closeSync(fd);
    }
  }

  fs.writeFileSync("schedule.json", JSON.stringify(schedule), { flag: "w" });
  return schedule;
}

// Generate the schedule when the module is loaded
generateBroadcastSchedule("public");
setInterval(async () => {
  await generateBroadcastSchedule("public");
}, 60 * 60 * 1000);