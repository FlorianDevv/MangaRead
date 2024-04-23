import fs from "fs";
import path from "path";
import { MobileNavbarComponent } from "../components/mobilenavbar";
import SearchBar from "../components/searchbar";

const publicDirectory = path.join(process.cwd(), "public");

let mangaData: { name: string; imagePath: string }[] = [];
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
      return { name: item.name, imagePath };
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
        <SearchBar mangaData={mangaData} />
      </>
    </MobileNavbarComponent>
  );
}
