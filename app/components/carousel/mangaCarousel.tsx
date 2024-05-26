"use client";
import { Button } from "@/components/ui/button";
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  InfoIcon,
  PlayIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

function MangaDetailComponent({
  detail,
  emblaApi,
}: {
  detail: MangaDetails;
  emblaApi: EmblaCarouselType | null;
}) {
  const imageSrc = useMemo(
    () => `/${detail.name}/manga/Tome 01/01-001.webp`,
    [detail.name]
  );

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
      <div className="relative w-full flex justify-center mt-8">
        <div className="relative w-full flex justify-center">
          <div className="relative w-56 h-80">
            <Image
              src={imageSrc}
              alt="7"
              className="object-scale-down md:transform  md:transition-transform md:duration-500 md:rotate-12 md:hover:rotate-0 md:hover:scale-110"
              quality={10}
              fill
              placeholder="blur"
              blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
            />
          </div>
        </div>
      </div>

      <div className="relative w-full h-full flex items-end mb-4">
        <div className="relative w-32 m-2">
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

// MuteContext
const MuteContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const MuteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <MuteContext.Provider value={[isMuted, setIsMuted]}>
      {children}
    </MuteContext.Provider>
  );
};

export const useMute = () => {
  const context = useContext(MuteContext);
  if (context === undefined) {
    throw new Error("useMute must be used within a MuteProvider");
  }
  return context;
};

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
  const [isMuted, setIsMuted] = useMute();

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const videoSrc = useMemo(
    () => `/api/video?videoId=${detail.name}/anime/preview.mp4`,
    [detail.name]
  );
  const thumbnailSrc = useMemo(
    () => `/${detail.name}/anime/thumbnail.webp`,
    [detail.name]
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        const progress =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progress);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && videoRef.current && isActive) {
          videoRef.current.play();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (ref.current) {
      const currentRef = ref.current;
      observer.observe(currentRef);

      return () => {
        observer.unobserve(currentRef);
      };
    }
  }, [isActive]);

  return (
    <div
      className="relative flex-shrink-0 w-full h-126"
      key={detail.name}
      ref={ref}
    >
      {isIntersecting && (
        <>
          <video
            ref={videoRef}
            src={videoSrc}
            muted={isMuted}
            className="absolute w-full h-full object-cover"
            onEnded={() => emblaApi && emblaApi.scrollNext()}
            autoPlay
            playsInline
          />

          <div className="relative w-full h-full flex items-end">
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
                    <span className="hidden sm:block">
                      {data.carousel.startW}
                    </span>
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
                  className="absolute right-1 bottom-8 md:bottom-1/4 transform translate-y-1/2 m-4 bg-black bg-opacity-50 rounded-full p-1"
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
          <div className="h-1 bg-black  w-full bottom-0 absolute">
            <div
              style={{ width: `${progress}%` }}
              className="absolute h-1 bg-red-600"
            />
          </div>
        </>
      )}
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
      return (
        <MangaDetailComponent
          detail={detail as MangaDetails}
          emblaApi={emblaApi}
        />
      );
    default:
      return null;
  }
}

export default function EmblaCarousel(props: EmblaCarouselProps) {
  const { Details } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      const activeIndex = emblaApi.selectedScrollSnap();
      setActiveIndex(activeIndex);
    });
  }, [emblaApi]);

  const scrollPrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  };

  const scrollNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  return (
    <MuteProvider>
      <div className="relative overflow-hidden" ref={emblaRef}>
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
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full shadow-lg"
          onClick={scrollPrev}
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full shadow-lg"
          onClick={scrollNext}
        >
          <ChevronRight className="w-10 h-10" />
        </button>
        <div className="absolute bottom-2 left-1/2 flex space-x-2">
          {Details.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full flex items-center justify-center m-0 p-0 border  appearance-none tap-highlight-transparent 
    ${
      index === activeIndex ? "bg-white border-black" : "bg-black border-white"
    }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center box-border 
      ${
        index === activeIndex
          ? "shadow-inner text-body"
          : "shadow-inner text-detail-medium-contrast"
      }`}
              />
            </div>
          ))}
        </div>
      </div>
    </MuteProvider>
  );
}
