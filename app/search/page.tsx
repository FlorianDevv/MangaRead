import fs from "fs";
import path from "path";
import CategorySelector from "../components/catalogue";
import { MobileNavbarComponent } from "../components/mobilenavbar";

const publicDirectory = path.join(process.cwd(), "public");
interface Manga {
  name: string;
  category: string[];
  imagePath: string;
  type: "manga" | "anime" | "both";
  // Add other properties as needed
}
let mangaData: Manga[] = [];
try {
  const directoryItems = fs.readdirSync(publicDirectory, {
    withFileTypes: true,
  });
  mangaData = directoryItems
    .filter((item) => item.isDirectory() && item.name !== "icons") // keep only directories and remove 'icons'
    .map((item) => {
      const mangaPath = `/${item.name}/manga/Tome 01/01-001.webp`;
      const animePath = `/${item.name}/anime/Season01/01-001.webp`;
      const imagePath = fs.existsSync(path.join(publicDirectory, mangaPath))
        ? mangaPath
        : animePath;

      // Read the resume.json file
      const resumePath = path.join(publicDirectory, item.name, "resume.json");
      let category = [];
      if (fs.existsSync(resumePath)) {
        const resumeData = fs.readFileSync(resumePath, "utf-8");
        const resumeJson = JSON.parse(resumeData);
        category = resumeJson.categories;
      }
      const itemPath = path.join(publicDirectory, item.name);
      const isManga = fs.existsSync(path.join(itemPath, "manga"));
      const isAnime = fs.existsSync(path.join(itemPath, "anime"));
      let type: "manga" | "anime" | "both";
      if (isManga && isAnime) {
        type = "both";
      } else if (isManga) {
        type = "manga";
      } else {
        type = "anime";
      }
      return { name: item.name, imagePath, category, type };
    });
} catch (error) {
  console.error(`Failed to read public directory: ${error}`);
}

const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

export default function Page() {
  return (
    <MobileNavbarComponent activePage="Search">
      <>
        <h1 className="text-center text-3xl mb-4 mt-6">{data.search.title}</h1>
        <CategorySelector mangaData={mangaData} />
      </>
    </MobileNavbarComponent>
  );
}
