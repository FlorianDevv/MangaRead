import fs from "fs";
import { BookImage } from "lucide-react";
import dynamic from "next/dynamic";
import path from "path";
import { Suspense } from "react";
import MangaCard from "./components/mangaCard";
import { MobileNavbarComponent } from "./components/mobilenavbar";
import ResumeReading from "./components/resumereading";
interface MangaCardProps {
  mangaDetail: {
    name: string;
    synopsis: string | undefined;
    volume: number;
    type: "manga" | "anime" | "both";
  };
}
// ...

// Load the Carousel component asynchronously
const Carousel = dynamic(() => import("./components/mangaCarousel"));

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

    // Check if it's a manga, an anime or both
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

    return { name, synopsis, volume, type };
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

  const shuffledMangaDetails = [...mangaDetails].sort(
    () => Math.random() - 0.5
  );

  // Filter mangaDetails to only include manga, not anime
  const mangaOnlyDetails = shuffledMangaDetails.filter(
    (detail) => detail.type !== "anime"
  );

  // Get the first 5 elements or less if there are less than 5
  const selectedMangaDetails = mangaOnlyDetails.slice(
    0,
    Math.min(mangaOnlyDetails.length, 5)
  );

  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`../locales/${language}.json`);
  return (
    <MobileNavbarComponent activePage="Home">
      <div className="md:bg-[#0c0c0c] md:mx-24 lg:mx-48 2xl:mx-64">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="mx-1 md:mx-8 mt-2">
            <Carousel mangaDetails={selectedMangaDetails} />
          </div>
        </Suspense>
        <div className=" p-4 mt-6 ">
          <ResumeReading />
        </div>
        <hr className="my-8" />
        <h2 className="w-full flex uppercase item-center justify-center text-xl md:text-2xl mb-4 mt-6 md:ml-4 md:justify-start md:items-start ">
          {data.home.allMangasAvailable}
          <div className="ml-2">
            <BookImage />
          </div>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-2 lg:mx-4">
          {mangaDetails.map((mangaDetail) => (
            <MangaCard
              key={mangaDetail.name}
              mangaName={mangaDetail.name}
              type={mangaDetail.type}
            />
          ))}
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
