import fs from "fs";
import { open } from "sqlite";
import * as sqlite3 from "sqlite3";

export const dynamic = "force-dynamic";
fs.writeFile("launchTime.txt", Date.now().toString(), () => {});
const launchTime = Number(fs.readFileSync("launchTime.txt", "utf-8"));

export async function GET() {
  const now = Math.floor((Date.now() - launchTime) / 1000) % (7 * 24 * 60 * 60);
  const db = await open({ filename: "schedule.db", driver: sqlite3.Database });
  let currentVideo: any;

  const rows = await db.all(`
    SELECT * FROM schedule
  `);

  for (const row of rows) {
    if (row.start <= now && row.start + row.duration > now) {
      currentVideo = row;
      break;
    }
  }

  if (!currentVideo) {
    return Response.json({ error: "No current video found" });
  }

  const elapsedTime = now - currentVideo.start;

  return Response.json({
    ...currentVideo,
    elapsedTime,
  });
}
