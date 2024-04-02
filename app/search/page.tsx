import fs from "fs";
import path from "path";
import { MobileNavbarComponent } from "../components/mobilenavbar";
import SearchBar from "../components/searchbar";
const mangaDirectory = path.join(process.cwd(), "public");
const mangaNames: string[] = JSON.parse(
  fs.readFileSync(path.join(mangaDirectory, "manga.json"), "utf-8")
);
export default function Page() {
  return (
    <MobileNavbarComponent activePage="Search">
      <div>
        <h1 className="text-center text-3xl mb-4 mt-6">Recherche</h1>
        <SearchBar mangaNames={mangaNames} />
      </div>
    </MobileNavbarComponent>
  );
}
