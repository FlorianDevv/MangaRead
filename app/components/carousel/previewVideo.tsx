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

  const shuffledDetails = shuffleArray(Details);

  // Get the first 5 elements or less if there are less than 5
  const selectedMangaDetails = shuffledDetails.slice(
    0,
    Math.min(shuffledDetails.length, 5)
  );

  return (
    <>
      <EmblaCarousel Details={selectedMangaDetails} />
    </>
  );
}
