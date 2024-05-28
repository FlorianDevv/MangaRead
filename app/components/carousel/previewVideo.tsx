import { getDetails } from "../../types/getDetails";
import EmblaCarousel from "./Carousel";

export default function previewVideo() {
  let Details = getDetails();

  return (
    <>
      <EmblaCarousel Details={Array.isArray(Details) ? Details : [Details]} />
    </>
  );
}
