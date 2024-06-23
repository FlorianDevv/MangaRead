import fs from "fs";
import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { getAnimePathFromDb } from "./db/item/getItemDb";

type SeasonDetails = {
  season: string;
  episodes: number[];
};

type VolumeDetails = {
  name: string;
  totalPages: number;
  type: string;
  path: string;
};

export type ItemDetails = {
  animePath: string;
  mangaPath: string;
  name: string;
  synopsis?: string | undefined;
  volumes?: VolumeDetails[];
  types: ("manga" | "anime")[];
  seasons?: SeasonDetails[];
  episodeNumber?: number;
  categories?: string[];
};

const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

const dbPath = "db/items.db";

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function getDetails(
  slug?: string
): Promise<ItemDetails | ItemDetails[]> {
  const directory = path.join(process.cwd(), "public");
  const decodedSlug = decodeURIComponent(slug || "");
  const itemNames = decodedSlug
    ? [decodedSlug]
    : fs.readdirSync(directory).filter((name) => {
        const itemPath = path.join(directory, name);
        return fs.lstatSync(itemPath).isDirectory() && name !== "icons";
      });

  const itemDetailsPromises: Promise<ItemDetails>[] = itemNames.map(
    async (name) => {
      const itemPath = path.join(directory, name);
      const isManga = fs.existsSync(path.join(itemPath, "manga"));
      const isAnime = fs.existsSync(path.join(itemPath, "anime"));
      let types: ItemDetails["types"] = [];

      let synopsis: string | undefined;
      let categories: string[] = [];
      const resumePath = path.join(itemPath, "resume.json");
      if (fs.existsSync(resumePath)) {
        const data = JSON.parse(fs.readFileSync(resumePath, "utf-8"));
        synopsis = data.synopsis;
        categories = data.categories ?? [];
      }

      let volumes: VolumeDetails[] = [];
      let mangaPath = "";
      if (isManga) {
        types.push("manga");
        const mangaDirectory = path.join(itemPath, "manga");
        volumes = fs
          .readdirSync(mangaDirectory)
          .filter((volume) => {
            const volumePath = path.join(mangaDirectory, volume);
            return fs.lstatSync(volumePath).isDirectory();
          })
          .map((volume) => {
            const volumePath = path.join(mangaDirectory, volume);
            const images = fs.readdirSync(volumePath);
            const totalPages = images.length;
            const volumeNumber = parseInt(
              volume.match(/\d+$/)?.[0] || "",
              10
            ).toString();
            return {
              name: volumeNumber,
              totalPages,
              type: data.resume.volume,
              path: volumePath,
            };
          });
        mangaPath = mangaDirectory.replace(/\\/g, "/");
      }

      let seasonDetails: SeasonDetails[] = [] as SeasonDetails[];
      let animePath = "";
      if (isAnime) {
        types.push("anime");
        let baseAnimePath = path.join(itemPath, "anime").replace(/\\/g, "/");
        const animeId = name;
        try {
          baseAnimePath = await getAnimePathFromDb(animeId);
          baseAnimePath = path.join(baseAnimePath).replace(/\\/g, "/");
        } catch (error) {
          console.error(error);
        }

        try {
          const allDirectories = fs
            .readdirSync(baseAnimePath)
            .filter((season) => {
              const seasonPath = path.join(baseAnimePath, season);
              const isDirectory = fs.lstatSync(seasonPath).isDirectory();
              return isDirectory;
            });
          const seasons = allDirectories.filter((season) =>
            /^Season\d+$/i.test(season)
          );
          if (seasons.length === 0) {
          }

          seasonDetails = seasons
            .map((season) => {
              const seasonPath = path
                .join(baseAnimePath, season)
                .replace(/\\/g, "/");
              try {
                const episodes = fs
                  .readdirSync(seasonPath)
                  .filter((episode) => {
                    return path.extname(episode) === ".mp4";
                  })
                  .map((episode) => {
                    const match = episode.match(/(\d+)\.mp4$/);
                    return match ? parseInt(match[1], 10) : 0;
                  });

                if (episodes.length === 0) {
                }

                const seasonMatch = season.match(/Season(\d+)$/i);
                const seasonNumber = seasonMatch
                  ? parseInt(seasonMatch[1], 10).toString()
                  : season;
                return {
                  season: seasonNumber,
                  episodes,
                };
              } catch (error) {
                return null;
              }
            })
            .filter((detail): detail is SeasonDetails => detail !== null);
        } catch (error) {}
        animePath = baseAnimePath.replace(/\\/g, "/");
      }

      return {
        name,
        synopsis,
        types,
        seasons: seasonDetails,
        categories,
        volumes,
        episodeNumber: seasonDetails.reduce(
          (total, season) => total + season.episodes.length,
          0
        ),
        mangaPath,
        animePath,
      };
    }
  );

  const itemDetails = await Promise.all(itemDetailsPromises);

  if (decodedSlug) {
    return itemDetails[0];
  }
  return itemDetails;
}

export async function storeDetailsInDatabase(details: ItemDetails[]) {
  const db = await openDb();

  for (const item of details) {
    const typesAndPaths = JSON.stringify(
      item.types.map((type) => {
        return {
          type,
          path: type === "manga" ? item.mangaPath : item.animePath,
        };
      })
    );

    // Vérifier si l'élément existe déjà
    const existingItem = await db.get(
      `SELECT * FROM items WHERE title = ?`,
      item.name
    );

    if (existingItem) {
      await db.run(
        `UPDATE items SET types_and_paths = ? WHERE title = ?`,
        typesAndPaths,
        item.name
      );
    } else {
      await db.run(
        `INSERT INTO items (title, types_and_paths) VALUES (?, ?)`,
        item.name,
        typesAndPaths
      );
    }
  }

  console.log("Items have been stored in the database.");
}
