import { openDbItem } from "./generateItemDb";

export async function getAnimePathFromDb(name: string): Promise<string> {
  const db = await openDbItem();
  const statement = `
    SELECT types_and_paths
    FROM items
    WHERE title = ?
  `;
  const row = await db.get(statement, [name]);
  if (row && row.types_and_paths) {
    const typesAndPaths = JSON.parse(row.types_and_paths);
    const animePath = typesAndPaths.find(
      (item: { type: string }) => item.type === "anime"
    )?.path;
    if (animePath) {
      return animePath;
    } else {
      throw new Error("Anime path not found in the database.");
    }
  } else {
    throw new Error("Item not found in the database.");
  }
}
