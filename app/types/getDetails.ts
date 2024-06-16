import fs from "fs";
import path from "path";

type SeasonDetails = {
  season: string;
  episodes: number[];
};

type VolumeDetails = {
  name: string;
  totalPages: number;
  type: string;
};

export type ItemDetails = {
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

export function getDetails(slug?: string): ItemDetails | ItemDetails[] {
  const directory = path.join(process.cwd(), "public");
  const dedodedSlug = decodeURIComponent(slug || "");
  const itemNames = dedodedSlug
    ? [dedodedSlug]
    : fs.readdirSync(directory).filter((name) => {
        const itemPath = path.join(directory, name);
        return fs.lstatSync(itemPath).isDirectory() && name !== "icons";
      });

  const itemDetails: ItemDetails[] = itemNames.map((name) => {
    const itemPath = path.join(directory, name);
    // Check if it's a manga, an anime or both
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
    if (isManga) {
      types.push("manga");
      volumes = fs
        .readdirSync(path.join(itemPath, "manga"))
        .filter((volume) => {
          const volumePath = path.join(itemPath, "manga", volume);
          return fs.lstatSync(volumePath).isDirectory();
        })
        .map((volume) => {
          const volumePath = path.join(itemPath, "manga", volume);
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
            path: path.dirname(volumePath), // Get the parent directory of the volumePath
          };
        });
    }

    let seasonDetails: SeasonDetails[] = [] as SeasonDetails[];
    if (isAnime) {
      console.log("Processing anime...");
      types.push("anime");
      let baseAnimePath = path.join(itemPath, "anime").replace(/\\/g, "/");
      console.log(`Default anime path: ${baseAnimePath}`);

      const pathJson = path
        .join(baseAnimePath, "path.json")
        .replace(/\\/g, "/");
      console.log(`Checking for path.json at: ${pathJson}`);
      if (fs.existsSync(pathJson)) {
        console.log("path.json exists. Reading specified path...");
        let pathData = fs.readFileSync(pathJson, "utf-8").trim();
        pathData = pathData.replace(/^"|"$/g, "");
        if (pathData) {
          baseAnimePath = path.join(pathData.replace(/\\/g, "/"), "anime");
          console.log(`Using specified path from path.json: ${baseAnimePath}`);
        }
      } else {
        console.log("No path.json found, using default path.");
      }

      console.log(`Reading seasons and episodes from: ${baseAnimePath}`);

      try {
        console.log(`Looking for seasons in: ${baseAnimePath}`);
        const allDirectories = fs
          .readdirSync(baseAnimePath)
          .filter((season) => {
            const seasonPath = path.join(baseAnimePath, season);
            const isDirectory = fs.lstatSync(seasonPath).isDirectory();
            console.log(
              `Found directory: '${season}': isDirectory=${isDirectory}`
            );
            return isDirectory;
          });
        const seasons = allDirectories.filter((season) =>
          /^Season\d+$/i.test(season)
        );
        console.log(`Seasons found: ${seasons.length}`);
        if (seasons.length === 0) {
          console.log(
            "No seasons directories found. Please check the directory naming."
          );
        }

        seasonDetails = seasons
          .map((season) => {
            const seasonPath = path
              .join(baseAnimePath, season)
              .replace(/\\/g, "/");
            console.log(`Processing season at path: ${seasonPath}`);
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

              console.log(`Episodes found in ${season}: ${episodes.length}`);
              if (episodes.length === 0) {
                console.log(
                  `No episodes found in ${season}. Please check the files.`
                );
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
              console.error(
                `Error processing season at path: ${seasonPath}`,
                error
              );
              return null;
            }
          })
          .filter((detail): detail is SeasonDetails => detail !== null);
      } catch (error) {
        console.error("Error reading seasons and episodes.", error);
      }
      console.log(`Updated anime path: ${baseAnimePath}`);
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
    };
  });

  if (dedodedSlug) {
    return itemDetails[0];
  }
  return itemDetails;
}
