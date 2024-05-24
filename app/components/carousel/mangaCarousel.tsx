"use client";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { BookOpen, InfoIcon, PlayIcon, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
interface MangaDetails {
  name: string;
  synopsis?: string;
  volume: number;
  type: "manga";
}

interface AnimeDetails {
  name: string;
  synopsis?: string;
  episode: number;
  season: number;
  type: "anime";
}

interface BothDetails {
  name: string;
  synopsis?: string;
  volume: number;
  episode: number;
  season: number;
  type: "both";
}

type Details = MangaDetails | AnimeDetails | BothDetails;
interface EmblaCarouselProps {
  Details: Details[];
}

const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

function MangaDetailComponent({ detail }: { detail: MangaDetails }) {
  return (
    <div className="flex-shrink-0 w-full" key={detail.name}>
      <div className="relative w-full h-96 flex">
        <Image
          src={`/${detail.name}/manga/Tome 01/01-001.webp`}
          alt={"cover image back"}
          className="object-cover opacity-25 blur-lg"
          fill
          sizes="10vw"
          quality={1}
          placeholder="blur"
          blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
        />
        <div className="w-1/2 text-left mt-2 ml-2 sm:ml-24 space-y-4 flex flex-col justify-center  z-10">
          <h1 className="text-3xl">{detail.name}</h1>
          <p className="text-sm pr-2 line-clamp-4  lg:line-clamp-5 text-gray-100">
            {detail.synopsis}
          </p>
          <p className="text-lg text-gray-100 font-normal">
            {detail.volume} Volumes
          </p>
          <div>
            <Link href={`/manga/${detail.name}/Tome%2001`}>
              <Button>
                <BookOpen className="mr-2" />
                <span className="sm:hidden">{data.carousel.read}</span>
                <span className="hidden sm:block">{data.carousel.start}</span>
              </Button>
            </Link>

            <Link href={`/detail/${detail.name}`}>
              <Button
                variant="ghost"
                className="rounded-full p-2 m-4 bg-opacity-50 bg-black"
              >
                <InfoIcon />
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative w-56 flex justify-end items-end xl:ml-20">
          <Image
            src={`/${detail.name}/manga/Tome 01/01-001.webp`}
            alt={"cover image front"}
            className="object-contain md:transform  md:transition-transform md:duration-500 md:rotate-12 md:hover:rotate-0 md:hover:scale-125"
            quality={50}
            width={600}
            height={900}
            sizes="(min-width: 1080px) 216px, (min-width: 1000px) calc(-15vw + 374px), (min-width: 780px) calc(15.5vw + 72px), (min-width: 560px) 224px, (min-width: 380px) calc(18.75vw + 123px), calc(75vw - 83px)"
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
          />
        </div>
      </div>
    </div>
  );
}

function AnimeDetailComponent({
  detail,
  isActive,
}: {
  detail: AnimeDetails;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);
  const [isMuted, setIsMuted] = useState(true);

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative flex-shrink-0 w-full" key={detail.name}>
      <video
        ref={videoRef}
        src="https://files.vidstack.io/sprite-fight/720p.mp4"
        muted={isMuted}
        className="absolute w-full h-full object-cover"
      />

      <div className="relative w-full h-96 flex items-end">
        <div className="relative w-32">
          <Image
            src={`/${detail.name}/anime/thumbnail.webp`}
            alt={"cover image front"}
            className="object-contain"
            quality={50}
            width={300}
            height={450}
            sizes="(min-width: 1080px) 216px, (min-width: 1000px) calc(-15vw + 374px), (min-width: 780px) calc(15.5vw + 72px), (min-width: 560px) 224px, (min-width: 380px) calc(18.75vw + 123px), calc(75vw - 83px)"
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
          />
        </div>
        <div className="w-1/2 text-left ml-4 space-y-2 flex flex-col justify-center">
          <h1 className="text-xl">{detail.name}</h1>
          <p className="text-xs pr-2 line-clamp-2  lg:line-clamp-3 text-gray-100">
            {detail.synopsis}
          </p>
          <p className="text-sm text-gray-100 font-normal">
            {detail.season} {data.seasonSelect.season}, {detail.episode}{" "}
            {data.episodeSelect.episode}
          </p>
          <div>
            <Link href={`/anime/${detail.name}/season01/episode01`}>
              <Button>
                <PlayIcon className="mr-2" />
                <span className="sm:hidden">{data.carousel.watch}</span>
                <span className="hidden sm:block">{data.carousel.startW}</span>
              </Button>
            </Link>

            <Link href={`/detail/${detail.name}`}>
              <Button
                variant="ghost"
                className="rounded-full p-2 m-4 bg-opacity-50 bg-black"
              >
                <InfoIcon />
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleMute}
              className="absolute right-2 m-4 bg-black bg-opacity-50 rounded-full p-2"
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailComponent({
  detail,
  isActive,
}: {
  detail: AnimeDetails | MangaDetails;
  isActive: boolean;
}) {
  if ("season" in detail && "volume" in detail) {
    const randomNumber = Math.random();

    if (randomNumber < 0.5) {
      return <AnimeDetailComponent detail={detail} isActive={isActive} />;
    }

    return <MangaDetailComponent detail={detail as unknown as MangaDetails} />;
  }

  if ("season" in detail) {
    return <AnimeDetailComponent detail={detail} isActive={isActive} />;
  }

  return <MangaDetailComponent detail={detail} />;
}

export default function EmblaCarousel(props: EmblaCarouselProps) {
  const { Details } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      playOnInit: true,
      delay: 18000,
      speed: 5,
      pauseOnHover: true,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  ]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      const activeIndex = emblaApi.selectedScrollSnap();
      setActiveIndex(activeIndex);
    });
  }, [emblaApi]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {Details.map((Detail, index) => {
          const isActive = index === activeIndex;
          return (
            <DetailComponent
              detail={Detail as AnimeDetails | MangaDetails}
              isActive={isActive}
              key={Detail.name}
            />
          );
        })}
      </div>
    </div>
  );
}
