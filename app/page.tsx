import fs from "fs";
import { Telescope } from "lucide-react";
import Link from "next/link";
import path from "path";
import MangaCard from "./components/mangaCard";
import MangaDetails from "./components/mangaDetails";
import { MobileNavbarComponent } from "./components/mobilenavbar";
import ResumeReading from "./components/resumereading";
import "./scrollbar.css";

export default function Home() {
  const mangaDirectory = path.join(process.cwd(), "public");
  const mangaNames = fs.readdirSync(mangaDirectory).filter((name) => {
    const itemPath = path.join(mangaDirectory, name);
    return fs.lstatSync(itemPath).isDirectory() && name !== "icons";
  });

  const mangaDetails = mangaNames.map((name) => {
    const itemPath = path.join(mangaDirectory, name);
    let synopsis: string | undefined;
    const synopsisPath = path.join(itemPath, "resume.json");
    if (fs.existsSync(synopsisPath)) {
      synopsis = JSON.parse(fs.readFileSync(synopsisPath, "utf-8")).synopsis;
    }

    return { name, synopsis };
  });

  // Write the mangaNames array to a JSON file
  fs.writeFileSync(
    path.join(mangaDirectory, "manga.json"),
    JSON.stringify(mangaNames)
  );

  return (
    <MobileNavbarComponent activePage="Home">
      <div>
        <h2 className="flex justify-center items-center text-3xl mb-4 mt-2">
          Découverte
          <div className="ml-2">
            <Telescope />
          </div>
        </h2>
        <div className="mx-1 md:mx-8">
          <MangaDetails mangaDetails={mangaDetails} />
        </div>
        <ResumeReading />
        <hr className="my-8" />
        <h2 className="flex justify-center items-center text-3xl mb-4">
          Tous les Mangas disponibles
        </h2>
        <div className="mx-4">
          <div className="flex overflow-x-scroll overflow-wrap break-word">
            {mangaNames.map((mangaName) => (
              <Link
                key={mangaName}
                href={`/manga/${mangaName}`}
                className="m-2"
              >
                <MangaCard key={mangaName} mangaName={mangaName} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
