import fs from "fs";
import { NextResponse } from "next/server";
import VideoLib from "node-video-lib";
import path from "path";
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function* getVideoFiles(dir) {
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
export let schedule = [];
async function generateBroadcastSchedule(dir) {
  fs.writeFileSync("launchTime.txt", Date.now().toString());
  let videoFiles = Array.from(getVideoFiles(dir));

  let totalDuration = 0;
  let previousTitle = "";

  // Get the current time
  let currentTime = new Date();

  let videoIndex = 0;

  while (totalDuration < 8 * 60 * 60) {
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
      let movie = VideoLib.MovieParser.parse(fd);
      const duration = movie.relativeDuration();
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

      if (totalDuration >= 7 * 24 * 60 * 60) break; // 7 days in seconds
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
  // Get the last item in the schedule
  const lastItem = schedule[schedule.length - 1];

  // Calculate the time difference between now and the last item's start time
  const timeDifference = lastItem.realStartTime - Date.now();

  // If the last item's start time is less than 8 hours in the future, generate a new schedule
  if (timeDifference < 8 * 60 * 60 * 1000) {
    await generateBroadcastSchedule("public");
  }
}, 60 * 1000);
export async function GET() {
  // Read the schedule from the JSON file
  let schedule = JSON.parse(fs.readFileSync("schedule.json", "utf8"));

  // Get the current time in seconds since the epoch
  let now = Date.now();

  // If the schedule is empty or the last video is past, regenerate the schedule
  if (
    schedule.length === 0 ||
    schedule[schedule.length - 1].realStartTime < now
  ) {
    schedule = await generateBroadcastSchedule("public");
  }

  return NextResponse.json({
    schedule,
  });
}
