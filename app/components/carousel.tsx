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
      delay: 4000,
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
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {selectedMangaDetails.map((mangaDetail) => (
            <div className="embla__slide" key={mangaDetail.name}>
              <div className="embla__slide__inner">
                <Image
                  src={`/${mangaDetail.name}/Tome 01/01-001.webp`}
                  alt={mangaDetail.name}
                  className="absolute w-full h-full object-cover opacity-30"
                  fill
                  quality={1}
                  style={{ filter: "blur(10px)", objectFit: "cover" }}
                />
                <div className="relative flex justify-center h-screen w-screen">
                  <div className="w-1/2 text-left  mt-2 ml-2  sm:ml-24 space-y-4 flex flex-col">
                    <h1 className="text-3xl">{mangaDetail.name}</h1>
                    <p className="text-sm pr-2 line-clamp-4 lg:line-clamp-6 text-gray-200 font-light">
                      {mangaDetail.synopsis}
                    </p>
                    <Link
                      href={`/manga/${mangaDetail.name}`}
                      className="space-x-2"
                    >
                      <Button>
                        <BookOpen className="mr-2" /> Commencer la lecture
                      </Button>
                    </Link>
                  </div>
                  <div className="relative flex sm:items-center sm:justify-center w-full h-1/4 sm:h-1/3 overflow-hidden">
                    <Link href={`/manga/${mangaDetail.name}`}>
                      <Image
                        src={`/${mangaDetail.name}/Tome 01/01-001.webp`}
                        alt={mangaDetail.name}
                        className="object-contain transform transition-transform duration-500 rotate-12 hover:rotate-0"
                        quality={25}
                        fill
                      />
                    </Link>
                  </div>
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
