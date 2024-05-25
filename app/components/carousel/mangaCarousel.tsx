"use client";
import { Button } from "@/components/ui/button";
import { EmblaCarouselType } from "embla-carousel";
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
  const imageSrc = `/${detail.name}/manga/Tome 01/01-001.webp`;

  return (
    <div
      className="relative flex-shrink-0 w-full h-126 flex flex-col items-center"
      key={detail.name}
    >
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
      <div className="relative w-full flex justify-center mb-4">
        <div className="relative w-full flex flex-row">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`relative w-full h-110 sm:w-1/2 md:w-1/4 lg:w-1/4 ${
                i > 0 ? "hidden md:block" : ""
              }`}
            >
              <Image
                key={i}
                src={`/${detail.name}/manga/Tome 01/01-${String(i + 7).padStart(
                  3,
                  "0"
                )}.webp`}
                alt={`manga page ${i + 7}`}
                className="object-contain w-full h-full"
                quality={50}
                fill
                placeholder="blur"
                blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full h-full flex items-end">
        <div className="relative w-32 m-2 flex-col flex">
          <Image
            src={imageSrc}
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
          <p className="text-xs pr-2 line-clamp-2 lg:line-clamp-3 text-gray-100 max-w-lg">
            {detail.synopsis}
          </p>
          <p className="text-sm text-gray-100 font-normal">
            {detail.volume} {data.carousel.volumes}
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
      </div>
    </div>
  );
}

function AnimeDetailComponent({
  detail,
  isActive,
  emblaApi,
}: {
  detail: AnimeDetails;
  isActive: boolean;
  emblaApi: EmblaCarouselType | null;
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

  const videoSrc = `/api/video?videoId=${detail.name}/anime/preview.mp4`;
  const thumbnailSrc = `/${detail.name}/anime/thumbnail.webp`;

  return (
    <div className="relative flex-shrink-0 w-full" key={detail.name}>
      <video
        ref={videoRef}
        src={videoSrc}
        muted={isMuted}
        className="absolute w-full h-full object-cover"
        onEnded={() => emblaApi && emblaApi.scrollNext()}
      />

      <div className="relative w-full h-126 flex items-end">
        <div className="relative w-32 m-2">
          <Image
            src={thumbnailSrc}
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
          <p className="text-xs pr-2 line-clamp-2 lg:line-clamp-3 text-gray-100 max-w-lg">
            {detail.synopsis}
          </p>
          <p className="text-sm text-gray-100 font-normal">
            {detail.season} {data.carousel.seasons}, {detail.episode}{" "}
            {data.carousel.episodes}
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
              className="absolute right-2 bottom-1/4 transform translate-y-1/2 m-4 bg-black bg-opacity-50 rounded-full p-1"
            >
              {isMuted ? (
                <VolumeX className="w-10 h-10" />
              ) : (
                <Volume2 className="w-10 h-10" />
              )}
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
  emblaApi,
}: {
  detail: AnimeDetails | MangaDetails | BothDetails;
  isActive: boolean;
  emblaApi: EmblaCarouselType | null;
}) {
  switch (detail.type) {
    case "anime":
      return (
        <AnimeDetailComponent
          detail={detail as AnimeDetails}
          isActive={isActive}
          emblaApi={emblaApi}
        />
      );
    case "manga":
      return <MangaDetailComponent detail={detail as MangaDetails} />;
    case "both":
      const randomNumber = Math.random();
      if (randomNumber < 0.5) {
        return (
          <AnimeDetailComponent
            detail={detail as unknown as AnimeDetails}
            isActive={isActive}
            emblaApi={emblaApi}
          />
        );
      } else {
        return (
          <MangaDetailComponent detail={detail as unknown as MangaDetails} />
        );
      }
    default:
      return null;
  }
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
      stopOnInteraction: true,
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
              emblaApi={emblaApi || null}
            />
          );
        })}
      </div>
    </div>
  );
}
