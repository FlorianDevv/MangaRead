"use client";
import { useCallback, useEffect, useRef } from "react";

interface Anime {
  title: string;
  episode: string;
  season: string;
}

export default function Player(anime: Anime) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const lastAnimeRef = useRef(anime);

  const updateAnimeInfo = useCallback(
    (
      animeList: any[],
      animeIndex: number,
      savedTime?: number,
      duration?: string
    ) => {
      const currentSavedTime =
        savedTime !== undefined
          ? savedTime
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

  const initializePlayer = useCallback(() => {
    import("plyr").then((Plyr) => {
      if (playerRef.current) {
        const player = new Plyr.default(playerRef.current);

        player.on("loadedmetadata", () => {
          const duration = new Date(player.duration * 1000)
            .toISOString()
            .substr(11, 8);
          const animeList = JSON.parse(
            localStorage.getItem("animeInfo") || "[]"
          );
          const animeIndex = animeList.findIndex(
            (a: { anime: string }) => a.anime === anime.title
          );
          const animeInfo = updateAnimeInfo(
            animeList,
            animeIndex,
            undefined,
            duration
          );
          if (animeIndex !== -1) {
            player.currentTime = animeInfo.savedTime;
          }
        });

        player.on("timeupdate", () => {
          const currentSecond = Math.round(player.currentTime);
          const animeList = JSON.parse(
            localStorage.getItem("animeInfo") || "[]"
          );
          const animeIndex = animeList.findIndex(
            (a: { anime: string }) => a.anime === anime.title
          );
          if (animeIndex !== -1) {
            updateAnimeInfo(animeList, animeIndex, currentSecond);
          }
        });
      }
    });
  }, [anime.title, updateAnimeInfo]);

  useEffect(() => {
    const animeList = JSON.parse(localStorage.getItem("animeInfo") || "[]");
    const animeIndex = animeList.findIndex(
      (a: { anime: string }) => a.anime === anime.title
    );
    if (animeIndex !== -1) {
      const savedTime = animeList[animeIndex].savedTime;
      updateAnimeInfo(animeList, animeIndex, savedTime);
    }
  }, [anime.episode, anime.season, anime.title, updateAnimeInfo]);

  useEffect(() => {
    initializePlayer();
    lastAnimeRef.current = anime;
  }, [anime, initializePlayer]);

  const seasonNumber = anime.season.match(/\d+/)?.[0].padStart(2, "0");
  const episodeNumber = anime.episode.match(/\d+/)?.[0].padStart(3, "0");
  const videoSrc = `/${anime.title}/anime/Season${seasonNumber}/${seasonNumber}-${episodeNumber}.mp4`;

  return <video ref={playerRef} src={videoSrc} controls />;
}
