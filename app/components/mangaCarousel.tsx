"use client";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
interface MangaDetailsProps {
  mangaDetails: { name: string; synopsis?: string; volume: number }[];
}

export default function EmblaCarousel(props: MangaDetailsProps) {
  const { mangaDetails } = props;
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      playOnInit: true,
      delay: 5000,
      speed: 5,
      pauseOnHover: true,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  ]);
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
  return (
    <section className="mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div
          className="flex ml-[-1rem] backface-hidden touch-action[pan-y]"
          style={{ backfaceVisibility: "hidden", touchAction: "pan-y" }}
        >
          {mangaDetails.map((mangaDetail) => (
            <div
              className="flex-none pl-4 min-w-0 "
              key={mangaDetail.name}
              style={{ flex: "0 0 100%" }}
            >
              <div className="relative w-full h-[19rem] overflow-hidden flex">
                <Image
                  src={`/${mangaDetail.name}/Tome 01/01-001.webp`}
                  alt={"cover image"}
                  className="absolute w-full h-full object-cover opacity-25 z-0"
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 30vw"
                  quality={1}
                  style={{ filter: "blur(12px)", objectFit: "cover" }}
                />
                <div className="w-1/2 text-left mt-2 ml-2 sm:ml-24 space-y-4 flex flex-col justify-center  z-10">
                  <h1 className="text-3xl">{mangaDetail.name}</h1>
                  <p className="text-sm pr-2 line-clamp-4  lg:line-clamp-5 text-gray-100 font-normal">
                    {mangaDetail.synopsis}
                  </p>
                  <p className="text-lg text-gray-100 font-normal">
                    {mangaDetail.volume} Volumes
                  </p>
                  <Link
                    href={`/manga/${mangaDetail.name}`}
                    className="space-x-2"
                  >
                    <Button>
                      <BookOpen className="mr-2" />
                      <span className="sm:hidden">{data.carousel.read}</span>
                      <span className="hidden sm:block">
                        {data.carousel.start}
                      </span>
                    </Button>
                  </Link>
                </div>
                <div className="relative w-56 flex justify-end items-end xl:ml-20">
                  <Image
                    src={`/${mangaDetail.name}/Tome 01/01-001.webp`}
                    alt={"cover image"}
                    className="object-contain md:transform  md:transition-transform md:duration-500 md:rotate-12 md:hover:rotate-0 md:hover:scale-125"
                    quality={1}
                    layout="responsive"
                    width={500}
                    height={300}
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 30vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
