import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { getDetails, storeDetailsInDatabase } from "../../getDetails";
export async function openDbItem() {
  return open({
    filename: "db/items.db",
    driver: sqlite3.Database,
  });
}
export default async function createSimplifiedDatabaseSchema() {
  const db = await openDbItem();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      types_and_paths JSON NOT NULL
    )
  `);

  console.log("Simplified database schema created or already exists.");
}
(async () => {
  await createSimplifiedDatabaseSchema();
  const details = await getDetails();
  if (Array.isArray(details)) {
    await storeDetailsInDatabase(details);
  } else {
    await storeDetailsInDatabase([details]);
  }
})();
