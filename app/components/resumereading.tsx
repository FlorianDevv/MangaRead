// ResumeReading.tsx
"use client";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CirclePlay, Clock3, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

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
  Name?: string;
}

function reducer(
  state: any,
  action: { type: any; payload: any; name?: string }
) {
  switch (action.type) {
    case "SET_MANGA":
      return {
        ...state,
        manga: action.payload.filter(
          (manga: { manga: string }) =>
            !action.name || manga.manga === action.name
        ),
      };
    case "SET_ANIME":
      return {
        ...state,
        anime: action.payload.filter(
          (anime: { anime: string }) =>
            !action.name || anime.anime === action.name
        ),
      };
    default:
      throw new Error();
  }
}

export default function ResumeReading({ Name }: ResumeReadingProps) {
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
  const [state, dispatch] = useReducer(reducer, { manga: [], anime: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data asynchronously
    Promise.all([
      localStorage.getItem("mangaInfo"),
      localStorage.getItem("animeInfo"),
    ]).then(([storedManga, storedAnime]) => {
      if (storedManga) {
        const parsedManga = JSON.parse(storedManga).map((item: MangaInfo) => ({
          ...item,
          dateWatched: new Date(item.dateWatched),
        }));
        dispatch({ type: "SET_MANGA", payload: parsedManga, name: Name });
      }
      if (storedAnime) {
        const parsedAnime = JSON.parse(storedAnime).map((item: AnimeInfo) => ({
          ...item,
          dateWatched: new Date(item.dateWatched),
        }));
        dispatch({ type: "SET_ANIME", payload: parsedAnime, name: Name });
      }
      setIsLoading(false);
    });
  }, [Name]);

  const sortedMangaState = useMemo(() => {
    return [...state.manga].sort(
      (a, b) =>
        new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime()
    );
  }, [state.manga]);

  const sortedAnimeState = useMemo(() => {
    return [...state.anime].sort(
      (a, b) =>
        new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime()
    );
  }, [state.anime]);

  const combinedState = useMemo(() => {
    return [...sortedMangaState, ...sortedAnimeState].sort(
      (a, b) =>
        new Date(b.dateWatched).getTime() - new Date(a.dateWatched).getTime()
    );
  }, [sortedMangaState, sortedAnimeState]);

  const deleteManga = useCallback(
    (mangaName: string) => {
      const newMangaState = state.manga.filter(
        (manga: { manga: string }) => manga.manga !== mangaName
      );
      dispatch({
        type: "SET_MANGA",
        payload: newMangaState,
      });
      localStorage.setItem("mangaInfo", JSON.stringify(newMangaState));
    },
    [state.manga]
  );

  const deleteAnime = useCallback(
    (animeName: string) => {
      const newAnimeState = state.anime.filter(
        (anime: { anime: string }) => anime.anime !== animeName
      );
      dispatch({
        type: "SET_ANIME",
        payload: newAnimeState,
      });
      localStorage.setItem("animeInfo", JSON.stringify(newAnimeState));
    },
    [state.anime]
  );
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

  if (!state.manga.length && !state.anime.length) {
    return null;
  }

  return (
    <div>
      <h2 className="w-full flex uppercase item-center justify-center text-xl md:text-2xl mb-4 mt-6 md:ml-4 md:justify-start md:items-start">
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
                className="m-2 relative ease-in-out transform group hover:scale-105 transition-transform duration-300"
              >
                <div className="flex flex-col overflow-hidden rounded-lg relative">
                  <Link
                    key={index}
                    href={`/manga/${mangaInfo.manga}/${mangaInfo.volume}/`}
                  >
                    <div className="relative h-48 md:h-56 w-32 sm:w-48 md:w-56">
                      <Image
                        src={`/${mangaInfo.manga}/manga/Tome 01/01-001.webp`}
                        alt={mangaInfo.manga + " resume"}
                        quality={50}
                        fill
                        sizes="(min-width: 780px) 224px, (min-width: 640px) 192px, 128px"
                        className="object-cover opacity-100 group-hover:opacity-50 transition-opacity duration-300"
                        placeholder="blur"
                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
                      />
                      <div className="absolute inset-0 flex items-center justify-center hover:scale-110 transition-transform duration-500">
                        <div className="bg-black bg-opacity-50 rounded-full p-2">
                          <BookOpen className="w-10 h-10" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-blue-900 text-sm px-2 py-1 rounded">
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
                <div className="flex flex-col overflow-hidden rounded-lg relative">
                  <Link
                    key={index}
                    href={`/anime/${animeInfo.anime}/${animeInfo.season}/${animeInfo.episode}`}
                  >
                    <div className="relative h-48 md:h-56 w-32 sm:w-48 md:w-56">
                      <Image
                        src={`/${animeInfo.anime}/anime/thumbnail.webp`}
                        alt={animeInfo.anime + " resume"}
                        quality={50}
                        fill
                        sizes="(min-width: 780px) 224px, (min-width: 640px) 192px, 128px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center hover:scale-110 transition-transform duration-500">
                        <div className="bg-black bg-opacity-50 rounded-full p-2">
                          <Play className="w-10 h-10" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-red-900 text-sm px-2 py-1 rounded">
                        Anime
                      </div>
                    </div>
                    <div className="flex-grow p-2">
                      <p className="text-sm overflow-wrap transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
                        {decodeURIComponent(animeInfo.anime)}
                      </p>
                      <div className="text-sm mt-2 text-gray-400 overflow-wrap break-words flex flex-col md:flex-row">
                        <p>
                          {data.seasonSelect.season +
                            " " +
                            animeInfo.season.split("season")[1]}
                        </p>
                        <p className="md:mx-4 md:my-0 my-2 hidden md:block">
                          -
                        </p>
                        <p>
                          {data.episodeSelect.episode +
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
                          .slice(11, 19)
                          .replace(/^00:/, "")}` === "-00:00"
                          ? "✅"
                          : `-${new Date(
                              (animeInfo.duration
                                .split(":")
                                .reduce((acc, time) => 60 * acc + +time, 0) -
                                animeInfo.savedTime) *
                                1000
                            )
                              .toISOString()
                              .slice(11, 19)
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
    </div>
  );
}

export function AnimeProgress({ Name }: { Name: string }) {
  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);

  useEffect(() => {
    const storedAnime = localStorage.getItem("animeInfo");
    if (storedAnime) {
      const parsedAnime = JSON.parse(storedAnime).find(
        (item: AnimeInfo) => item.anime === Name
      );
      if (parsedAnime) {
        setAnimeInfo({
          ...parsedAnime,
          dateWatched: new Date(parsedAnime.dateWatched),
        });
      }
    }
  }, [Name]);

  if (!animeInfo) {
    return (
      <div className="relative">
        <Link href={`/anime/${Name}/season01/episode01`}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-60 flex items-center justify-center text-white text-center bg-black bg-opacity-50 rounded-full transition-all duration-200 ease-in-out hover:bg-opacity-75 hover:scale-110">
            <CirclePlay className="w-14 h-14" />
          </div>
        </Link>
      </div>
    );
  }

  const totalSeconds = animeInfo.duration
    .split(":")
    .reduce((acc: number, time: string | number) => 60 * acc + +time, 0);
  const progress = (animeInfo.savedTime / totalSeconds) * 100;
  const formattedSeason = parseInt(animeInfo.season.replace(/\D/g, ""));
  const formattedEpisode = parseInt(animeInfo.episode.replace(/\D/g, ""));

  const formatTime = (seconds: number, addMin: boolean = true) => {
    const minutes = Math.round(seconds / 60);
    return addMin ? `${minutes} min` : `${minutes}`;
  };

  const savedTime = formatTime(animeInfo.savedTime);
  const totalDuration = formatTime(totalSeconds, false);
  const episodeLink = `/anime/${animeInfo.anime}/${animeInfo.season}/${animeInfo.episode}`;
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
  return (
    <>
      <div className="relative">
        <Link href={episodeLink}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-60 flex items-center justify-center text-white text-center bg-black bg-opacity-50 rounded-full transition-all duration-200 ease-in-out hover:bg-opacity-75 hover:scale-110">
            <CirclePlay className="w-14 h-14" />
          </div>
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold">
            {`S${formattedSeason} : E${formattedEpisode} `}
            <span className="text-sm text-gray-300">
              {data.episodeSelect.episode} {formattedEpisode}
            </span>
          </span>
        </div>
        <div className="relative flex items-center">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#333333] flex-grow mr-2">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
            ></div>
          </div>
          <span className=" -translate-y-2 text-xs text-opacity-50 self-center">{`${savedTime} sur ${totalDuration}`}</span>
        </div>
      </div>
    </>
  );
}
