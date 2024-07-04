import { open } from "sqlite";
import * as sqlite3 from "sqlite3";
import type { Schedule } from "../route";

export const dynamic = "force-dynamic";

export async function GET() {
	const now = Date.now();

	const db = await open({
		filename: "db/schedule.db",
		driver: sqlite3.Database,
	});

	let currentVideo: Schedule | null = null;

	const rows = await db.all(
		`
        SELECT * FROM schedule
        WHERE realStartTime <= ?
        ORDER BY realStartTime DESC
        LIMIT 1
        `,
		now,
	);

	if (rows.length > 0) {
		currentVideo = rows[0];
		// Ensure currentVideo is not null before accessing its properties
		if (currentVideo) {
			const elapsedTime = (now - currentVideo.realStartTime) / 1000;

			// Delete all entries with a start time less than the current video's start time
			await db.run(
				`
                DELETE FROM schedule
                WHERE realStartTime < ?
                `,
				currentVideo.realStartTime,
			);

			return Response.json({
				...currentVideo,
				elapsedTime,
			});
		}
	}
	return Response.json({ error: "No current video found" });
}
