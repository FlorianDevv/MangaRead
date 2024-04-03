import fs from "fs";
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

  let synopsis: string | undefined;
  const synopsisPath = path.join(mangaDirectory, "resume.json");
  if (fs.existsSync(synopsisPath)) {
    synopsis = JSON.parse(fs.readFileSync(synopsisPath, "utf-8")).synopsis;
  }

  // Write the mangaNames array to a JSON file
  fs.writeFileSync(
    path.join(mangaDirectory, "manga.json"),
    JSON.stringify(mangaNames)
  );

  return (
    <MobileNavbarComponent activePage="Home">
      <div className="text-white">
        <h2 className="text-center text-3xl mb-4">Découvrez nos Mangas</h2>
        <div className="flex overflow-x-scroll overflow-wrap break-word">
          <MangaDetails mangaNames={mangaNames} />
        </div>
        <ResumeReading />
        <hr className="my-8" />
        <h2 className="text-center text-3xl mb-4">
          Tous les Mangas disponible
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
