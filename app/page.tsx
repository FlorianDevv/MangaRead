import fs from "fs";
import Link from "next/link";
import path from "path";
import { Suspense } from "react";
import MangaCard from "./components/mangaCard";
import Carousel from "./components/mangaDetails";
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
    const volume = fs.readdirSync(itemPath).filter((volume) => {
      const volumePath = path.join(itemPath, volume);
      return fs.lstatSync(volumePath).isDirectory();
    }).length;

    return { name, synopsis, volume };
  });

  // Write the mangaNames array to a JSON file
  fs.writeFileSync(
    path.join(mangaDirectory, "manga.json"),
    JSON.stringify(mangaNames)
  );

  function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(mangaNames);

  return (
    <MobileNavbarComponent activePage="Home">
      <div className="lg:mx-48 md:mx-24 md:bg-[#0c0c0c]">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="mx-1 md:mx-8 mt-2">
            <Carousel mangaDetails={mangaDetails} />
          </div>
        </Suspense>
        <div className=" p-4 rounded-lg shadow-lg mt-6 ">
          <ResumeReading />
        </div>
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
