"use client";
import { useCallback, useEffect, useRef } from "react";

interface Anime {
  title: string;
  episodes: number;
  season: number;
}

export default function Player(anime: Anime) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const lastSeasonRef = useRef(anime.season);
  const lastEpisodeRef = useRef(anime.episodes);

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
              episode: anime.episodes,
              savedTime: currentSecond,
            };
            localStorage.setItem("animeInfo", JSON.stringify(animeInfo));
            lastSavedTime = currentSecond;
          }
        });
      }
    });
  }, [anime.episodes, anime.season, anime.title]);

  useEffect(() => {
    initializePlayer();
  }, [anime.episodes, anime.season, anime.title, initializePlayer]);

  // Ajoutez un effet secondaire pour réinitialiser savedTime lorsque la saison ou l'épisode change
  useEffect(() => {
    if (
      anime.season !== lastSeasonRef.current ||
      anime.episodes !== lastEpisodeRef.current
    ) {
      const animeInfo = JSON.parse(localStorage.getItem("animeInfo") || "{}");
      animeInfo.savedTime = 0;
      localStorage.setItem("animeInfo", JSON.stringify(animeInfo));
      initializePlayer();
    }
    lastSeasonRef.current = anime.season;
    lastEpisodeRef.current = anime.episodes;
  }, [anime.season, anime.episodes, initializePlayer]);

  return (
    <>
      <p>{anime.title}</p>
      <p>{anime.episodes}</p>
      <p>{anime.season}</p>
      <p>Player</p>
      <video
        ref={playerRef}
        src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
        controls
      />
    </>
  );
}
