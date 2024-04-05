"use client";
import { Button } from "@/components/ui/button";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
type PropType = {
  mangaDetails: { name: string; synopsis?: string }[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { mangaDetails, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({
      playOnInit: true,
      delay: 5000,
      loop: true,
      speed: 5,
      pauseOnHover: true,
    }),
  ]);
  // Shuffle mangaDetails array
  const shuffledMangaDetails = mangaDetails.sort(() => Math.random() - 0.5);

  // Get the first 5 elements or less if there are less than 5
  const selectedMangaDetails = shuffledMangaDetails.slice(
    0,
    Math.min(shuffledMangaDetails.length, 5)
  );

  return (
    <section className="mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div
          className="flex ml-[-1rem] backface-hidden touch-action[pan-y]"
          style={{ backfaceVisibility: "hidden", touchAction: "pan-y" }}
        >
          {selectedMangaDetails.map((mangaDetail) => (
            <div
              className="flex-none pl-[1rem] min-w-0"
              key={mangaDetail.name}
              style={{ flex: "0 0 100%" }}
            >
              <div className="relative w-full h-[19rem] overflow-hidden flex">
                <Image
                  src={`/${mangaDetail.name}/Tome 01/01-001.webp`}
                  alt={mangaDetail.name}
                  className="absolute w-full h-full object-cover opacity-30 z-0"
                  fill
                  sizes="50vw"
                  quality={1}
                  style={{ filter: "blur(12px)", objectFit: "cover" }}
                />
                <div className="w-1/2 text-left mt-2 ml-2 sm:ml-24 space-y-4 flex flex-col justify-center  z-10">
                  <h1 className="text-3xl">{mangaDetail.name}</h1>
                  <p className="text-sm pr-2 line-clamp-4 lg:line-clamp-6 text-gray-200 font-light">
                    {mangaDetail.synopsis}
                  </p>
                  <Link
                    href={`/manga/${mangaDetail.name}`}
                    className="space-x-2"
                  >
                    <Button>
                      <BookOpen className="mr-2" />
                      <span className="sm:hidden">Lire</span>
                      <span className="hidden sm:block">
                        Commencer la lecture
                      </span>
                    </Button>
                  </Link>
                </div>
                <div className="relative w-1/2 flex justify-center items-center">
                  <Link href={`/manga/${mangaDetail.name}`}>
                    <Image
                      src={`/${mangaDetail.name}/Tome 01/01-001.webp`}
                      alt={mangaDetail.name}
                      className="object-contain md:transform  md:transition-transform md:duration-500 md:rotate-12 md:hover:rotate-0 md:hover:scale-125 w-full h-full shine"
                      quality={1}
                      fill
                      sizes="100vw"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
