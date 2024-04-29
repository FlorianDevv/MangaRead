import fs from "fs";
import { NextResponse } from "next/server";
import { schedule } from "../route";
const launchTime = Number(fs.readFileSync("launchTime.txt", "utf-8"));

export async function GET() {
  const now = Math.floor((Date.now() - launchTime) / 1000) % (7 * 24 * 60 * 60);
  const currentIndex = schedule.findIndex(
    (video) => video.start <= now && video.start + video.duration > now
  );
  const nextVideo = schedule[currentIndex + 1];
  return NextResponse.json(nextVideo);
}
