import fs from "fs";
import path from "path";

export function getDetails() {
  const directory = path.join(process.cwd(), "public");
  const itemNames = fs.readdirSync(directory).filter((name) => {
    const itemPath = path.join(directory, name);
    return fs.lstatSync(itemPath).isDirectory() && name !== "icons";
  });

  const itemDetails = itemNames.map((name) => {
    const itemPath = path.join(directory, name);
    // Check if it's a manga, an anime or both
    const isManga = fs.existsSync(path.join(itemPath, "manga"));
    const isAnime = fs.existsSync(path.join(itemPath, "anime"));
    let type: "manga" | "anime" | "both";

    let synopsis: string | undefined;
    const synopsisPath = path.join(itemPath, "resume.json");
    if (fs.existsSync(synopsisPath)) {
      synopsis = JSON.parse(fs.readFileSync(synopsisPath, "utf-8")).synopsis;
    }
    const volume = isManga
      ? fs.lstatSync(path.join(itemPath, "manga")).isDirectory() // Check if it's a directory
        ? fs.readdirSync(path.join(itemPath, "manga")).filter((volume) => {
            const volumePath = path.join(itemPath, "manga", volume);
            return fs.lstatSync(volumePath).isDirectory();
          }).length
        : 0
      : 0;
    if (isManga && isAnime) {
      type = "both";
    } else if (isManga) {
      type = "manga";
    } else {
      type = "anime";
    }

    let season = 0;
    let episode = 0;
    if (isAnime) {
      const animePath = path.join(itemPath, "anime");
      const seasons = fs.readdirSync(animePath).filter((season) => {
        const seasonPath = path.join(animePath, season);
        return fs.lstatSync(seasonPath).isDirectory();
      });
      season = seasons.length;
      episode = seasons.reduce((total, season) => {
        const seasonPath = path.join(animePath, season);
        const episodes = fs.readdirSync(seasonPath).filter((episode) => {
          return path.extname(episode) === ".mp4";
        });
        return total + episodes.length;
      }, 0);
    }

    return { name, synopsis, volume, type, season, episode };
  });

  return itemDetails;
}
