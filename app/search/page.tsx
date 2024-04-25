import fs from "fs";
import path from "path";
import CategorySelector from "../components/catalogue";
import { MobileNavbarComponent } from "../components/mobilenavbar";
import { getDetails } from "../types/getDetails";

const publicDirectory = path.join(process.cwd(), "public");
interface Manga {
  name: string;
  category: string[];
  type: "manga" | "anime" | "both";
}
let mangaData: Manga[] = [];
try {
  const itemDetails = getDetails();
  mangaData = itemDetails.map((item) => {
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

    return { name: item.name, imagePath, category, type: item.type };
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
