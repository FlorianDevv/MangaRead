import { getDetails } from "../../types/getDetails";
import EmblaCarousel from "./mangaCarousel";

//FIX BUG SHUFFLE DOESN'T WORK ON SERVER SIDE
export default function previewVideo() {
  const Details = getDetails();

  function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  // Separate anime and non-anime details
  const animeDetails = Details.filter((detail) => detail.type === "anime");
  const nonAnimeDetails = Details.filter((detail) => detail.type !== "anime");

  // Shuffle them separately
  const shuffledAnimeDetails = shuffleArray(animeDetails);
  const shuffledNonAnimeDetails = shuffleArray(nonAnimeDetails);

  // Combine them
  const shuffledDetails = [...shuffledAnimeDetails, ...shuffledNonAnimeDetails];

  // Get the first 10 elements or less if there are less than 10
  const selectedMangaDetails = shuffledDetails.slice(
    0,
    Math.min(shuffledDetails.length, 10)
  );

  return (
    <>
      <EmblaCarousel Details={selectedMangaDetails} />
    </>
  );
}