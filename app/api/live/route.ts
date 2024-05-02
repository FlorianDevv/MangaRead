import fs from "fs";
import { NextResponse } from "next/server";
import { generateBroadcastSchedule } from "./live";
export const dynamic = "force-dynamic";
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

  return new NextResponse(JSON.stringify(schedule));
}
