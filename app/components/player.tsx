"use client";
import {
  MediaPlayer,
  MediaProvider,
  MediaProviderAdapter,
  Poster,
  isHTMLVideoElement,
  isVideoProvider,
} from "@vidstack/react";
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
interface Anime {
  title: string;
  episode: string;
  season: string;
  episodes: Episode[];
  seasons: Season[];
}

type Episode = {
  name: string;
};

type Season = {
  name: string;
};
export default function Player(anime: Anime) {
  const lastAnimeRef = useRef(anime);
  const seasonNumber = useMemo(
    () => anime.season.match(/\d+/)?.[0].padStart(2, "0"),
    [anime.season]
  );
  const episodeNumber = useMemo(
    () => anime.episode.match(/\d+/)?.[0].padStart(3, "0"),
    [anime.episode]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [src, setSrc] = useState("");
  const getAnimeListAndIndex = useCallback(() => {
    let animeList = JSON.parse(localStorage.getItem("animeInfo") || "[]");
    if (animeList.length === 0) {
      const animeInfo = {
        anime: anime.title,
        season: anime.season,
        episode: anime.episode,
        savedTime: 0,
        duration: "00:00:00",
        dateWatched: Date.now(),
      };
      animeList = [animeInfo];
      localStorage.setItem("animeInfo", JSON.stringify(animeList));
      setIsLoading(false);
    }

    const animeIndex = animeList.findIndex(
      (a: { anime: string }) => a.anime === anime.title
    );
    setIsLoading(false);
    const currentSrc = `/api/video?videoId=${encodeURIComponent(
      `${anime.title}/anime/Season${seasonNumber}/${seasonNumber}-${episodeNumber}.mp4`
    )}`;
    setSrc(currentSrc);
    return { animeList, animeIndex };
  }, [anime.title, anime.season, anime.episode, seasonNumber, episodeNumber]);
  const updateAnimeInfo = useCallback(
    (
      animeList: any[],
      animeIndex: number,
      savedTime?: number,
      duration?: string
    ) => {
      setIsLoading(true); // Set loading state to true at the start of the update

      const currentSavedTime =
        savedTime !== undefined
          ? savedTime - 1
          : animeList[animeIndex]?.savedTime || 0;
      const currentDuration =
        duration || animeList[animeIndex]?.duration || "00:00:00";
      const animeInfo =
        animeIndex === -1
          ? {
              anime: anime.title,
              season: anime.season,
              episode: anime.episode,
              savedTime: currentSavedTime,
              duration: currentDuration,
              dateWatched: Date.now(),
            }
          : {
              ...animeList[animeIndex],
              season: anime.season,
              episode: anime.episode,
              savedTime:
                animeList[animeIndex].season !== lastAnimeRef.current.season ||
                animeList[animeIndex].episode !== lastAnimeRef.current.episode
                  ? 0
                  : currentSavedTime,
              duration: currentDuration,
              dateWatched: Date.now(),
            };

      if (animeIndex === -1) animeList.push(animeInfo);
      else animeList[animeIndex] = animeInfo;
      localStorage.setItem("animeInfo", JSON.stringify(animeList));

      setIsLoading(false); // Set loading state to false after the update is done

      return animeInfo;
    },
    [anime]
  );

  const onProviderSetup: any = useCallback(
    (provider: MediaProviderAdapter) => {
      if (isVideoProvider(provider) && isHTMLVideoElement(provider.video)) {
        const player = provider.video;

        player.oncanplaythrough = () => {
          const { animeList, animeIndex } = getAnimeListAndIndex();
          if (
            animeIndex !== -1 &&
            player.currentTime !== animeList[animeIndex].savedTime
          ) {
            player.currentTime = animeList[animeIndex].savedTime;
          }

          // Update the duration of the anime
          const duration = new Date(player.duration * 1000)
            .toISOString()
            .substring(11, 19);
          updateAnimeInfo(animeList, animeIndex, undefined, duration);
          setIsLoading(false);
        };

        player.ontimeupdate = () => {
          const currentSecond = Math.round(player.currentTime);
          const { animeList, animeIndex } = getAnimeListAndIndex();
          if (
            animeIndex !== -1 &&
            currentSecond !== animeList[animeIndex].savedTime &&
            currentSecond > 0
          ) {
            updateAnimeInfo(animeList, animeIndex, currentSecond);
          }
        };
      }
    },
    [updateAnimeInfo, getAnimeListAndIndex]
  );

  useEffect(() => {
    const { animeList, animeIndex } = getAnimeListAndIndex();
    if (animeIndex !== -1) {
      const savedTime = animeList[animeIndex].savedTime;
      updateAnimeInfo(animeList, animeIndex, savedTime);
    }
  }, [
    anime.episode,
    anime.season,
    anime.title,
    updateAnimeInfo,
    getAnimeListAndIndex,
  ]);

  useEffect(() => {
    lastAnimeRef.current = anime;
  }, [anime, onProviderSetup]);

  const thumbnailSrc = useMemo(
    () =>
      `/${anime.title}/anime/Season${seasonNumber}/${seasonNumber}-${episodeNumber}.webp`,
    [anime.title, seasonNumber, episodeNumber]
  );

  return (
    <div className="mt-4 flex flex-col items-center justify-center h-screen w-full">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full h-full ">
          <MediaPlayer
            key={src}
            title={
              decodeURIComponent(anime.title) +
              " - S" +
              anime.season.replace(/\D/g, "") +
              " E" +
              anime.episode.replace(/\D/g, "")
            }
            src={{ src: src, type: "video/mp4" }}
            playsInline
            onProviderSetup={onProviderSetup}
            className="w-full h-full object-contain"
          >
            <MediaProvider>
              <Poster className="vds-poster" src={thumbnailSrc} />
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} />
            <DefaultAudioLayout icons={defaultLayoutIcons} />
          </MediaPlayer>
        </div>
      )}
    </div>
  );
}
