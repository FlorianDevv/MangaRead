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
    <>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {mangaDetails.map((mangaDetail, index) => (
            <div className="flex-shrink-0 w-full" key={mangaDetail.name}>
              <div className="relative w-full h-80 flex">
                <Image
                  src={`/${mangaDetail.name}/manga/Tome 01/01-001.webp`}
                  alt={"cover image back"}
                  className="object-cover opacity-25 blur-md"
                  fill
                  sizes="25vw"
                  quality={1}
                  placeholder="blur"
                  blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
                  priority={index === 0}
                />
                <div className="w-1/2 text-left mt-2 ml-2 sm:ml-24 space-y-4 flex flex-col justify-center  z-10">
                  <h1 className="text-3xl">{mangaDetail.name}</h1>
                  <p className="text-sm pr-2 line-clamp-4  lg:line-clamp-5 text-gray-100">
                    {mangaDetail.synopsis}
                  </p>
                  <p className="text-lg text-gray-100 font-normal">
                    {mangaDetail.volume} Volumes
                  </p>
                  <div>
                    <Link href={`/manga/${mangaDetail.name}`}>
                      <Button>
                        <BookOpen className="mr-2" />
                        <span className="sm:hidden">{data.carousel.read}</span>
                        <span className="hidden sm:block">
                          {data.carousel.start}
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative w-56 flex justify-end items-end xl:ml-20">
                  <Image
                    src={`/${mangaDetail.name}/manga/Tome 01/01-001.webp`}
                    alt={"cover image front"}
                    className="object-contain md:transform  md:transition-transform md:duration-500 md:rotate-12 md:hover:rotate-0 md:hover:scale-125"
                    quality={50}
                    width={600}
                    height={900}
                    sizes="(min-width: 1080px) 216px, (min-width: 1000px) calc(-15vw + 374px), (min-width: 780px) calc(15.5vw + 72px), (min-width: 560px) 224px, (min-width: 380px) calc(18.75vw + 123px), calc(75vw - 83px)"
                    placeholder="blur"
                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
