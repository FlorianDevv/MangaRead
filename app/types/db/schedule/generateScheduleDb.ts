import fs from "node:fs";
import path from "node:path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

async function openDbSchedule() {
	const dbPath = path.resolve("db", "schedule.db");
	const dir = path.dirname(dbPath);

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	return open({
		filename: dbPath,
		driver: sqlite3.Database,
	});
}

export async function createScheduleTable() {
	const db = await openDbSchedule();
	await db.exec(`
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
	console.log("Table 'schedule' created or already exists.");
}

async function initializeDatabase() {
	try {
		await createScheduleTable();
		console.log("Database initialized successfully.");
	} catch (error) {
		console.error("Failed to initialize database:", error);
	}
}

initializeDatabase();
