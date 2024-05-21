"use client";
import {
  MediaPlayer,
  MediaProvider,
  MediaProviderAdapter,
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

import { useCallback, useEffect, useMemo, useRef } from "react";
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
    }
    const animeIndex = animeList.findIndex(
      (a: { anime: string }) => a.anime === anime.title
    );
    return { animeList, animeIndex };
  }, [anime.title, anime.season, anime.episode]);
  const updateAnimeInfo = useCallback(
    (
      animeList: any[],
      animeIndex: number,
      savedTime?: number,
      duration?: string
    ) => {
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

      return animeInfo;
    },
    [anime]
  );

  const onProviderSetup = useCallback(
    (provider: MediaProviderAdapter) => {
      if (isVideoProvider(provider) && isHTMLVideoElement(provider.video)) {
        const player = provider.video;

        player.onloadedmetadata = () => {
          const { animeList, animeIndex } = getAnimeListAndIndex();
          if (
            animeIndex !== -1 &&
            player.currentTime !== animeList[animeIndex].savedTime
          ) {
            player.currentTime = animeList[animeIndex].savedTime;

            const currentSecond = Math.round(player.currentTime);
            if (currentSecond !== animeList[animeIndex].savedTime) {
              updateAnimeInfo(animeList, animeIndex, currentSecond);
            }
          }

          // Update the duration of the anime
          const duration = new Date(player.duration * 1000)
            .toISOString()
            .substring(11, 19);
          updateAnimeInfo(animeList, animeIndex, undefined, duration);
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

  const seasonNumber = useMemo(
    () => anime.season.match(/\d+/)?.[0].padStart(2, "0"),
    [anime.season]
  );
  const episodeNumber = useMemo(
    () => anime.episode.match(/\d+/)?.[0].padStart(3, "0"),
    [anime.episode]
  );
  const videoSrc = useMemo(
    () =>
      `/api/video?videoId=${anime.title}/anime/Season${seasonNumber}/${seasonNumber}-${episodeNumber}.mp4`,
    [anime.title, seasonNumber, episodeNumber]
  );

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <div className="w-3/4 border-2 border-gray-800">
        <MediaPlayer
          title={
            decodeURIComponent(anime.title) +
            " - S" +
            anime.season +
            " E" +
            anime.episode
          }
          src={videoSrc}
          playsInline
          onProviderSetup={onProviderSetup}
        >
          <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
          <DefaultAudioLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
      </div>
    </div>
  );
}
