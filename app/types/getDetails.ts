import fs from "fs";
import path from "path";

type SeasonDetails = {
  season: string;
  episodes: number[];
  path: string;
};

type VolumeDetails = {
  name: string;
  totalPages: number;
  type: string;
  path: string;
};

export type ItemDetails = {
  name: string;
  synopsis?: string | undefined;
  volumes?: VolumeDetails[];
  types: ("manga" | "anime")[];
  seasons?: SeasonDetails[];
  episodeNumber?: number;
  categories?: string[];
  path?: string;
  pathImage?: string;
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

    let seasonDetails: SeasonDetails[] = [];
    if (isAnime) {
      types.push("anime");
      const animePath = path.join(itemPath, "anime");

      const seasons = fs.readdirSync(animePath).filter((season) => {
        const seasonPath = path.join(animePath, season);
        return fs.lstatSync(seasonPath).isDirectory();
      });

      seasonDetails = seasons.map((season) => {
        const seasonPath = path.join(animePath, season);
        const episodes = fs
          .readdirSync(seasonPath)
          .filter((episode) => path.extname(episode) === ".mp4")
          .map((episode) => {
            // Extract the episode number from the filename
            const match = episode.match(/(\d+)\.mp4$/);
            // Convert the episode number to a number to remove leading zeros
            return match ? parseInt(match[1]) : 0;
          });

        // Extract the season number from the directory name
        const seasonMatch = season.match(/(\d+)$/);
        const seasonNumber = seasonMatch
          ? parseInt(seasonMatch[1]).toString()
          : season;

        return {
          season: seasonNumber,
          episodes,
          path: path.dirname(seasonPath),
        }; // Get the parent directory of the seasonPath
      });
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
      path: isManga
        ? volumes[0]?.path
        : isAnime
        ? seasonDetails[0]?.path
        : undefined,
      pathImage: isManga
        ? path.join(volumes[0]?.path, "\\Tome 01\\01-001.webp")
        : isAnime
        ? path.join(seasonDetails[0]?.path, "thumbnail.webp")
        : undefined,
    };
  });

  if (dedodedSlug) {
    return itemDetails[0];
  }
  return itemDetails;
}
