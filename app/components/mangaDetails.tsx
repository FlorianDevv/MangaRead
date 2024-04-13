"use client";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import dynamic from "next/dynamic";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface MangaDetailsProps {
  mangaDetails: { name: string; synopsis?: string; volume: number }[];
}

export default function Carousel(props: MangaDetailsProps) {
  const { mangaDetails } = props;

  // Shuffle mangaDetails array
  const shuffledMangaDetails = mangaDetails.sort(() => Math.random() - 0.5);

  // Get the first 5 elements or less if there are less than 5
  const selectedMangaDetails = shuffledMangaDetails.slice(
    0,
    Math.min(shuffledMangaDetails.length, 5)
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <section className="mx-auto">
      <Slider {...settings}>
        {selectedMangaDetails.map((mangaDetail) => (
          <div
            className="flex-none pl-4 min-w-0 "
            key={mangaDetail.name}
            style={{ flex: "0 0 100%" }}
          >
            <div className="relative w-full h-[19rem] overflow-hidden flex">
              {mangaDetail.name ? ( // Check if mangaDetail.name is loaded
                <>
                  <Image
                    src={`/${mangaDetail.name}/Tome%2001/01-001.webp`}
                    alt={"cover image"}
                    className="absolute w-full h-full object-cover opacity-25 z-0"
                    fill
                    sizes="30vw"
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
                        <span className="sm:hidden">Lire</span>
                        <span className="hidden sm:block">
                          Commencer la lecture
                        </span>
                      </Button>
                    </Link>
                  </div>
                  <div className="relative w-1/2 flex justify-center items-center">
                    <Image
                      src={`/${mangaDetail.name}/Tome%2001/01-001.webp`}
                      alt={"cover image"}
                      className="object-contain md:transform  md:transition-transform md:duration-500 md:rotate-12 md:hover:rotate-0 md:hover:scale-125 shine w-full h-full"
                      quality={1}
                      fill
                      sizes="70vw"
                    />
                  </div>
                </>
              ) : (
                <div>...</div> // Render some loading state
              )}
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
