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

  if (schedule.length === 0) {
    await generateBroadcastSchedule("public");
    schedule = await db.all(`
      SELECT * FROM schedule
    `);
  }

  return Response.json(schedule);
}
