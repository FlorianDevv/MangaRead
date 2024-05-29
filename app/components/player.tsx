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
interface item {
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
export default function Player(item: item) {
  const lastItemRef = useRef(item);
  const seasonNumber = useMemo(
    () => item.season.match(/\d+/)?.[0].padStart(2, "0"),
    [item.season]
  );
  const episodeNumber = useMemo(
    () => item.episode.match(/\d+/)?.[0].padStart(3, "0"),
    [item.episode]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [src, setSrc] = useState("");
  const getitemListAndIndex = useCallback(() => {
    let itemList = JSON.parse(localStorage.getItem("itemInfo") || "[]");
    if (itemList.length === 0) {
      const itemInfo = {
        item: item.title,
        season: item.season,
        episode: item.episode,
        savedTime: 0,
        duration: "00:00:00",
        dateWatched: Date.now(),
      };
      itemList = [itemInfo];
      localStorage.setItem("itemInfo", JSON.stringify(itemList));
      setIsLoading(false);
    }

    const itemIndex = itemList.findIndex(
      (a: { item: string }) => a.item === item.title
    );
    setIsLoading(false);
    const currentSrc = `/api/video?videoId=${encodeURIComponent(
      `${item.title}/anime/Season${seasonNumber}/${seasonNumber}-${episodeNumber}.mp4`
    )}`;
    setSrc(currentSrc);
    return { itemList, itemIndex };
  }, [item.title, item.season, item.episode, seasonNumber, episodeNumber]);
  const updateitemInfo = useCallback(
    (
      itemList: any[],
      itemIndex: number,
      savedTime?: number,
      duration?: string
    ) => {
      setIsLoading(true); // Set loading state to true at the start of the update

      const currentSavedTime =
        savedTime !== undefined
          ? savedTime - 1
          : itemList[itemIndex]?.savedTime || 0;
      const currentDuration =
        duration || itemList[itemIndex]?.duration || "00:00:00";
      const itemInfo =
        itemIndex === -1
          ? {
              item: item.title,
              season: item.season,
              episode: item.episode,
              savedTime: currentSavedTime,
              duration: currentDuration,
              dateWatched: Date.now(),
            }
          : {
              ...itemList[itemIndex],
              season: item.season,
              episode: item.episode,
              savedTime:
                itemList[itemIndex].season !== lastItemRef.current.season ||
                itemList[itemIndex].episode !== lastItemRef.current.episode
                  ? 0
                  : currentSavedTime,
              duration: currentDuration,
              dateWatched: Date.now(),
            };

      if (itemIndex === -1) itemList.push(itemInfo);
      else itemList[itemIndex] = itemInfo;
      localStorage.setItem("itemInfo", JSON.stringify(itemList));

      setIsLoading(false); // Set loading state to false after the update is done

      return itemInfo;
    },
    [item]
  );

  const onProviderSetup: any = useCallback(
    (provider: MediaProviderAdapter) => {
      if (isVideoProvider(provider) && isHTMLVideoElement(provider.video)) {
        const player = provider.video;

        player.oncanplaythrough = () => {
          const { itemList, itemIndex } = getitemListAndIndex();
          if (
            itemIndex !== -1 &&
            player.currentTime !== itemList[itemIndex].savedTime
          ) {
            player.currentTime = itemList[itemIndex].savedTime;
          }

          // Update the duration of the item
          const duration = new Date(player.duration * 1000)
            .toISOString()
            .substring(11, 19);
          updateitemInfo(itemList, itemIndex, undefined, duration);
          setIsLoading(false);
        };

        player.ontimeupdate = () => {
          const currentSecond = Math.round(player.currentTime);
          const { itemList, itemIndex } = getitemListAndIndex();
          if (
            itemIndex !== -1 &&
            currentSecond !== itemList[itemIndex].savedTime &&
            currentSecond > 0
          ) {
            updateitemInfo(itemList, itemIndex, currentSecond);
          }
        };
      }
    },
    [updateitemInfo, getitemListAndIndex]
  );

  useEffect(() => {
    const { itemList, itemIndex } = getitemListAndIndex();
    if (itemIndex !== -1) {
      const savedTime = itemList[itemIndex].savedTime;
      updateitemInfo(itemList, itemIndex, savedTime);
    }
  }, [
    item.episode,
    item.season,
    item.title,
    updateitemInfo,
    getitemListAndIndex,
  ]);

  useEffect(() => {
    lastItemRef.current = item;
  }, [item, onProviderSetup]);

  const thumbnailSrc = useMemo(
    () =>
      `/${item.title}/item/Season${seasonNumber}/${seasonNumber}-${episodeNumber}.webp`,
    [item.title, seasonNumber, episodeNumber]
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
              decodeURIComponent(item.title) +
              " - S" +
              item.season.replace(/\D/g, "") +
              " E" +
              item.episode.replace(/\D/g, "")
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
