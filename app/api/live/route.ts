import { open } from "sqlite";
import * as sqlite3 from "sqlite3";
import { generateBroadcastSchedule } from "./live";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await open({ filename: "schedule.db", driver: sqlite3.Database });
  let schedule: any[] = [];

  schedule = await db.all(`
    SELECT * FROM schedule
  `);

  let now = Date.now();

  if (
    schedule.length === 0 ||
    schedule[schedule.length - 1].realStartTime < now
  ) {
    await generateBroadcastSchedule("public", true);
    schedule = await db.all(`
      SELECT * FROM schedule
    `);
  }

  return Response.json(schedule);
}
