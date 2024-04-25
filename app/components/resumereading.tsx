// ResumeReading.tsx
"use client";
import { Progress } from "@/components/ui/progress";
import { Clock3, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface MangaInfo {
  manga: string;
  volume: string;
  page: number;
  totalVolumes: number;
  dateWatched: number;
}

interface AnimeInfo {
  anime: string;
  season: string;
  episode: string;
  savedTime: number;
  duration: string;
  dateWatched: number;
}
interface ResumeReadingProps {
  mangaName?: string;
}

export default function ResumeReading({ mangaName }: ResumeReadingProps) {
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
  const [state, setState] = useState<MangaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animeState, setAnimeState] = useState<AnimeInfo[]>([]);

  useEffect(() => {
    const storedState = localStorage.getItem("mangaInfo");
    if (storedState) {
      const parsedState = JSON.parse(storedState).map((item: MangaInfo) => ({
        ...item,
        dateWatched: new Date(item.dateWatched),
      }));
      if (mangaName) {
        const filteredState = parsedState.filter(
          (manga: MangaInfo) => manga.manga === mangaName
        );
        setState(filteredState);
      } else {
        setState(parsedState);
      }
    }
    const storedAnimeState = localStorage.getItem("animeInfo");
    if (storedAnimeState) {
      const parsedAnimeState = JSON.parse(storedAnimeState).map(
        (item: AnimeInfo) => ({
          ...item,
          dateWatched: new Date(item.dateWatched),
        })
      );
      if (mangaName) {
        const filteredAnimeState = parsedAnimeState.filter(
          (anime: AnimeInfo) => anime.anime === mangaName
        );
        setAnimeState(filteredAnimeState);
      } else {
        setAnimeState(parsedAnimeState);
      }
    }

    setIsLoading(false);
  }, [mangaName]);

  const sortedMangaState = useMemo(() => {
    return [...state].sort(
      (a, b) =>
        new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime()
    );
  }, [state]);

  const sortedAnimeState = useMemo(() => {
    return [...animeState].sort(
      (a, b) =>
        new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime()
    );
  }, [animeState]);

  const combinedState = useMemo(() => {
    return [...sortedMangaState, ...sortedAnimeState].sort(
      (a, b) =>
        new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime()
    );
  }, [sortedMangaState, sortedAnimeState]);

  const deleteManga = useCallback((mangaName: string) => {
    setState((prevState) => {
      const newState = prevState.filter((manga) => manga.manga !== mangaName);
      localStorage.setItem("mangaInfo", JSON.stringify(newState));
      return newState;
    });
  }, []);

  const deleteAnime = useCallback((animeName: string) => {
    setAnimeState((prevState) => {
      const newState = prevState.filter((anime) => anime.anime !== animeName);
      localStorage.setItem("animeInfo", JSON.stringify(newState));
      return newState;
    });
  }, []);
  const calculateProgress = useMemo(() => {
    return (mangaInfo: MangaInfo) => {
      const currentVolumeNumber = parseInt(
        decodeURIComponent(mangaInfo.volume).split(" ")[1]
      );
      const totalVolumes = mangaInfo.totalVolumes;
      return (currentVolumeNumber / totalVolumes) * 100;
    };
  }, []);

  const calculateAnimeProgress = useMemo(() => {
    return (animeInfo: any) => {
      const totalSeconds = animeInfo.duration
        .split(":")
        .reduce((acc: number, time: string | number) => 60 * acc + +time);
      return (animeInfo.savedTime / totalSeconds) * 100;
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex overflow-x-scroll overflow-y-hidden">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="m-2 relative">
                <div className="flex flex-col items-stretch rounded-lg overflow-hidden ">
                  <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 flex-shrink-0 animate-pulse bg-gray-800"></div>
                  <div className="flex-grow p-2">
                    <div className="h-4 animate-pulse bg-gray-800"></div>
                    <div className="h-4 mt-2 animate-pulse bg-gray-800"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  }

  if (!state.length && !animeState.length) {
    return null;
  }

  return (
    <>
      <h2 className="w-full flex uppercase item-center justify-center text-xl md:text-2xl mb-4 mt-6 md:ml-4 md:justify-start md:items-start ">
        {data.resume.title}
        <div className="ml-2">
          <Clock3 />
        </div>
      </h2>
      <div className="flex overflow-x-scroll  hover:cursor-default overflow-y-hidden">
        {combinedState.map((item, index) => {
          if ("manga" in item) {
            const mangaInfo = item as MangaInfo;
            return (
              <div
                key={index}
                className="m-2 relative ease-in-out transform group hover:scale-105 transition-transform duration-300 "
              >
                <div className="flex flex-col   overflow-hidden ">
                  <Link
                    key={index}
                    href={`/manga/${mangaInfo.manga}/${mangaInfo.volume}/`}
                    className="ease-in-out transform  hover:scale-105 transition-transform duration-300"
                  >
                    <div className="relative h-48 md:h-56 w-32 sm:w-48 md:w-56 flex-shrink-0 shine">
                      <Image
                        src={`/${mangaInfo.manga}/manga/Tome 01/01-001.webp`}
                        alt={mangaInfo.manga}
                        quality={10}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="30vw"
                        className="transition-all duration-500 ease-in-out transform"
                      />

                      <div className="absolute bottom-2 left-2 bg-blue-900 text-xs px-2 py-1 rounded">
                        Manga
                      </div>
                    </div>
                    <div className="flex-grow p-2">
                      <p className="text-sm overflow-wrap transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
                        {decodeURIComponent(mangaInfo.manga)}
                      </p>
                      <div className="text-sm mt-2 text-gray-400 overflow-wrap break-words flex flex-col md:flex-row">
                        <p>
                          {data.resume.volume + " "}
                          {decodeURIComponent(mangaInfo.volume).split(" ")[1]}
                        </p>
                        <p className="md:mx-4 md:my-0 my-2 hidden md:block">
                          -
                        </p>
                        <p>
                          {data.resume.page + " "} {mangaInfo.page}
                        </p>
                      </div>
                    </div>
                    <div className=" flex flex-col items-center mx-4">
                      {mangaInfo.totalVolumes !== undefined && (
                        <>
                          <Progress
                            value={calculateProgress(mangaInfo)}
                            aria-label="Reading progress"
                          />
                          <p className="my-2 text-gray-200 text-sm ">
                            {`${
                              decodeURIComponent(mangaInfo.volume).split(" ")[1]
                            } / ${mangaInfo.totalVolumes}`}
                          </p>
                        </>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteManga(item.manga);
                    }}
                    className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 hover:text-red-600 bg-black shadow-lg shadow-black outline outline-2 outline-gray-700 rounded transition-all duration-200"
                    title="🗑️"
                  >
                    <X />
                  </button>
                </div>
              </div>
            );
          } else {
            const animeInfo = item as AnimeInfo;
            return (
              <div
                key={index}
                className="m-2 relative ease-in-out transform group hover:scale-105 transition-transform duration-300"
              >
                <div className="flex flex-col items-stretch rounded-lg overflow-hidden  ease-in-out transform  transition-transform duration-300">
                  <Link
                    key={index}
                    href={`/anime/${animeInfo.anime}/${animeInfo.season}/${animeInfo.episode}`}
                    className="ease-in-out transform  hover:scale-105 transition-transform duration-300"
                  >
                    <div className="relative h-48 md:h-56 w-32 sm:w-48 md:w-56 flex-shrink-0 shine">
                      <Image
                        src={`/${animeInfo.anime}/anime/Season01/01-001.webp`}
                        alt={animeInfo.anime}
                        quality={10}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="30vw"
                        className="transition-all duration-500 ease-in-out transform"
                      />
                      <div className="absolute bottom-2 left-2 bg-red-900 text-xs px-2 py-1 rounded">
                        Anime
                      </div>
                    </div>
                    <div className="flex-grow p-2">
                      <p className="text-sm overflow-wrap transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
                        {decodeURIComponent(animeInfo.anime)}
                      </p>
                      <div className="text-sm mt-2 text-gray-400 overflow-wrap break-words flex flex-col md:flex-row">
                        <p>
                          {data.episodeSelect.episode +
                            " " +
                            animeInfo.season.split("season")[1]}
                        </p>
                        <p className="md:mx-4 md:my-0 my-2 hidden md:block">
                          -
                        </p>
                        <p>
                          {data.seasonSelect.season +
                            " " +
                            animeInfo.episode.split("episode")[1]}
                        </p>
                      </div>
                    </div>
                    <div className="mx-4 flex flex-col items-center">
                      <Progress
                        value={calculateAnimeProgress(animeInfo)}
                        aria-label="Watching progress"
                      />
                      <p className="my-2 text-gray-200 text-sm ">
                        {`-${new Date(
                          (animeInfo.duration
                            .split(":")
                            .reduce((acc, time) => 60 * acc + +time, 0) -
                            animeInfo.savedTime) *
                            1000
                        )
                          .toISOString()
                          .substr(11, 8)
                          .replace(/^00:/, "")}`}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnime(item.anime);
                    }}
                    className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 hover:text-red-600 bg-black shadow-lg shadow-black outline outline-2 outline-gray-700 rounded transition-all duration-200"
                    title="🗑️"
                  >
                    <X />
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}
