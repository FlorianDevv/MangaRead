"use client";
import { useCallback, useEffect, useRef } from "react";

interface Anime {
  title: string;
  episode: string;
  season: string;
}

export default function Player(anime: Anime) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const lastSeasonRef = useRef(anime.season);
  const lastEpisodeRef = useRef(anime.episode);

  const initializePlayer = useCallback(() => {
    import("plyr").then((Plyr) => {
      if (playerRef.current) {
        const player = new Plyr.default(playerRef.current);
        let isCurrentTimeSet = false;

        player.on("canplay", () => {
          if (!isCurrentTimeSet) {
            const animeInfo = JSON.parse(
              localStorage.getItem("animeInfo") || "{}"
            );
            if (animeInfo.savedTime) {
              setTimeout(() => {
                player.currentTime = Number(animeInfo.savedTime);
              }, 100);
            } else {
              setTimeout(() => {
                player.currentTime = 0;
              }, 100);
            }

            isCurrentTimeSet = true;
          }
        });

        let lastSavedTime = Math.round(player.currentTime);
        player.on("timeupdate", () => {
          const currentSecond = Math.round(player.currentTime);
          if (currentSecond !== lastSavedTime) {
            const animeInfo = {
              anime: anime.title,
              season: anime.season,
              episode: anime.episode,
              savedTime: currentSecond,
            };
            localStorage.setItem("animeInfo", JSON.stringify(animeInfo));
            lastSavedTime = currentSecond;
          }
        });
      }
    });
  }, [anime.episode, anime.season, anime.title]);

  useEffect(() => {
    initializePlayer();
  }, [anime.episode, anime.season, anime.title, initializePlayer]);

  useEffect(() => {
    if (
      anime.season !== lastSeasonRef.current ||
      anime.episode !== lastEpisodeRef.current
    ) {
      const animeInfo = JSON.parse(localStorage.getItem("animeInfo") || "{}");
      animeInfo.savedTime = 0;
      localStorage.setItem("animeInfo", JSON.stringify(animeInfo));
      initializePlayer();
    }
    lastSeasonRef.current = anime.season;
    lastEpisodeRef.current = anime.episode;
  }, [anime.season, anime.episode, initializePlayer]);

  const seasonNumber = anime.season.split("season")[1];
  const episodeNumber = anime.episode.split("episode")[1];
  const videoSrc = `/${anime.title}/anime/Season${seasonNumber}/${episodeNumber}-001.mp4`;

  return <video ref={playerRef} src={videoSrc} controls />;
}
