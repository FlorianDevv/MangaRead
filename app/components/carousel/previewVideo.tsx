import { unstable_noStore as noStore } from "next/cache";
import { getDetails } from "../../types/getDetails";
import EmblaCarousel from "./Carousel";

export default function previewVideo() {
  noStore();

  let Details = getDetails();

  // Convert Details to an array if it's not already
  if (!Array.isArray(Details)) {
    Details = [Details];
  }

  // Randomize the array
  Details.sort(() => Math.random() - 0.5);

  // Get a subset of the array
  Details = Details.slice(0, 8);

  return (
    <>
      <EmblaCarousel Details={Details} />
    </>
  );
}
