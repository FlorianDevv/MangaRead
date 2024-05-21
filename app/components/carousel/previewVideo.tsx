import { getDetails } from "../../types/getDetails";
import EmblaCarousel from "./mangaCarousel";

export const dynamic = "force-dynamic";
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

  const shuffledDetails = shuffleArray(Details);

  // Filter mangaDetails to only include manga, not anime
  const mangaOnlyDetails = shuffledDetails.filter(
    (detail) => detail.type !== "anime"
  );

  // Get the first 5 elements or less if there are less than 5
  const selectedMangaDetails = mangaOnlyDetails.slice(
    0,
    Math.min(mangaOnlyDetails.length, 5)
  );

  return (
    <>
      <EmblaCarousel mangaDetails={selectedMangaDetails} />
    </>
  );
}
