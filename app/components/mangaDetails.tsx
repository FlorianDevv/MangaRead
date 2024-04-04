import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "./carousel";
interface MangaDetailsProps {
  mangaDetails: { name: string; synopsis?: string }[];
}

export default function MangaDetails({ mangaDetails }: MangaDetailsProps) {
  const OPTIONS: EmblaOptionsType = { loop: true };
  return (
    <>
      <EmblaCarousel mangaDetails={mangaDetails} options={OPTIONS} />
    </>
  );
}
