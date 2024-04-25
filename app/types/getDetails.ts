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
      ? fs.readdirSync(path.join(itemPath, "manga")).filter((volume) => {
          const volumePath = path.join(itemPath, "manga", volume);
          return fs.lstatSync(volumePath).isDirectory();
        }).length
      : 0;
    if (isManga && isAnime) {
      type = "both";
    } else if (isManga) {
      type = "manga";
    } else {
      type = "anime";
    }

    return { name, synopsis, volume, type };
  });

  return itemDetails;
}
