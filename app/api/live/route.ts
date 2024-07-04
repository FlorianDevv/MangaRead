import { open } from "sqlite";
import * as sqlite3 from "sqlite3";
import { generateBroadcastSchedule } from "./live";

export const dynamic = "force-dynamic";

export interface Schedule {
	title: string;
	season: number;
	episode: number;
	start: number;
	realStartTime: number;
	startTime: string;
	duration: number;
}

export async function GET() {
	const db = await open({
		filename: "db/schedule.db",
		driver: sqlite3.Database,
	});
	let schedule: Schedule[] = [];

	schedule = await db.all(`
    SELECT * FROM schedule
  `);

	if (schedule.length === 0) {
		await generateBroadcastSchedule();
		schedule = await db.all(`
      SELECT * FROM schedule
    `);
	}

	return Response.json(schedule);
}
