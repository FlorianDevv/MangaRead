import { open } from "sqlite";
import sqlite3 from "sqlite3";

async function openDbSchedule() {
  return open({
    filename: "db/schedule.db",
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
