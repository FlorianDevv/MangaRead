import fs from "fs";
import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const dbPath = "db/items.db";

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

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

async function getItemFromDb(slug?: string): Promise<any[]> {
  const db = await openDb();
  let query = `SELECT item_id, title, types_and_paths FROM items`;
  let params: any[] = [];

  if (slug) {
    query += ` WHERE title = ?`;
    params.push(slug);
  }

  return db.all(query, params);
}

export async function getDetails(
  slug?: string
): Promise<ItemDetails | ItemDetails[]> {
  const items = await getItemFromDb(slug);

  const itemDetailsPromises = items.map(async (item) => {
    const { title, types_and_paths } = item;
    const pathsInfo = JSON.parse(types_and_paths);

    let animePath = "";
    let mangaPath = "";
    const types: ("manga" | "anime")[] = [];

    pathsInfo.forEach((pathInfo: any) => {
      if (pathInfo.type === "manga") {
        mangaPath = path.join(pathInfo.path, "manga");
        types.push("manga");
      } else if (pathInfo.type === "anime") {
        animePath = path.join(pathInfo.path, "anime");
        types.push("anime");
      }
    });

    let synopsis: string | undefined;
    let categories: string[] = [];
    const resumePath = path.join(
      path.dirname(mangaPath || animePath),
      "resume.json"
    );
    if (fs.existsSync(resumePath)) {
      const data = JSON.parse(fs.readFileSync(resumePath, "utf-8"));
      synopsis = data.synopsis;
      categories = data.categories ?? [];
    }

    let volumes: VolumeDetails[] = [];
    if (mangaPath) {
      try {
        volumes = fs
          .readdirSync(mangaPath)
          .filter((volume) => {
            const volumePath = path.join(mangaPath, volume);
            return fs.lstatSync(volumePath).isDirectory();
          })
          .map((volume) => {
            const volumePath = path.join(mangaPath, volume);
            const images = fs.readdirSync(volumePath);
            const totalPages = images.length;
            const volumeNumber = parseInt(
              volume.match(/\d+$/)?.[0] || "",
              10
            ).toString();
            return {
              name: volumeNumber,
              totalPages,
              type: "volume",
              path: volumePath,
            };
          });
      } catch (error) {
        console.error(`Error processing manga path ${mangaPath}:`, error);
      }
    }

    let seasonDetails: SeasonDetails[] = [];
    if (animePath) {
      try {
        const allDirectories = fs.readdirSync(animePath).filter((season) => {
          const seasonPath = path.join(animePath, season);
          return fs.lstatSync(seasonPath).isDirectory();
        });
        const seasons = allDirectories.filter((season) =>
          /^Season\d+$/i.test(season)
        );

        seasonDetails = seasons
          .map((season) => {
            const seasonPath = path.join(animePath, season);
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

              const seasonMatch = season.match(/Season(\d+)$/i);
              const seasonNumber = seasonMatch
                ? parseInt(seasonMatch[1], 10).toString()
                : season;
              return {
                season: seasonNumber,
                episodes,
              };
            } catch (error) {
              console.error(`Error processing season ${season}:`, error);
              return null;
            }
          })
          .filter((detail): detail is SeasonDetails => detail !== null);
      } catch (error) {
        console.error(`Error processing anime path ${animePath}:`, error);
      }
    }

    return {
      name: title,
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
  });

  const itemDetails = await Promise.all(itemDetailsPromises);

  return slug ? itemDetails[0] : itemDetails;
}
