import { BookImage } from "lucide-react";
import Card from "./components/Card";
import Carousel from "./components/mangaCarousel";
import { MobileNavbarComponent } from "./components/mobilenavbar";
import ResumeReading from "./components/resumereading";
import { getDetails } from "./types/getDetails";

export default function Home() {
  const Details = getDetails();
  const itemNames = Details.map((detail) => detail.name);

  function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(itemNames);

  const shuffledMangaDetails = [...Details].sort(() => Math.random() - 0.5);

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
        <div className="mx-1 md:mx-8 mt-2">
          <Carousel mangaDetails={selectedMangaDetails} />
        </div>
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
          {Details.map((Detail) => (
            <Card key={Detail.name} Name={Detail.name} type={Detail.type} />
          ))}
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
