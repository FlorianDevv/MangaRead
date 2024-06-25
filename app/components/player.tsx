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

interface Item {
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

interface ItemInfo {
  anime: string;
  season: string;
  episode: string;
  savedTime: number;
  duration: string;
  dateWatched: number;
}

export default function Player(item: Item) {
  const lastItemRef = useRef<Item>(item);
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const seasonNumber = useMemo(
    () => item.season.match(/\d+/)?.[0].padStart(2, "0") || "00",
    [item.season]
  );

  const episodeNumber = useMemo(
    () => item.episode.match(/\d+/)?.[0].padStart(3, "0") || "000",
    [item.episode]
  );

  const [videoState, setVideoState] = useState({
    isLoading: true,
    src: "",
  });

  const { isLoading, src } = videoState;

  const getItemListAndIndex = useCallback(() => {
    let itemList: ItemInfo[] = JSON.parse(
      localStorage.getItem("animeInfo") || "[]"
    );

    if (itemList.length === 0) {
      const itemInfo: ItemInfo = {
        anime: item.title,
        season: item.season,
        episode: item.episode,
        savedTime: 0,
        duration: "00:00:00",
        dateWatched: Date.now(),
      };
      itemList = [itemInfo];
      localStorage.setItem("animeInfo", JSON.stringify(itemList));
    }

    const itemIndex = itemList.findIndex((a) => a.anime === item.title);
    const currentSrc = `/api/video?videoId=${encodeURIComponent(
      `${item.title}/anime/Season${seasonNumber}/${seasonNumber}-${episodeNumber}.mp4`
    )}`;
    setVideoState((prevState) => ({ ...prevState, src: currentSrc }));

    return { itemList, itemIndex };
  }, [item.title, item.season, item.episode, seasonNumber, episodeNumber]);

  const updateItemInfo = useCallback(
    (
      itemList: ItemInfo[],
      itemIndex: number,
      savedTime?: number,
      duration?: string
    ) => {
      const currentSavedTime =
        savedTime !== undefined && savedTime > 0
          ? savedTime - 1
          : itemList[itemIndex]?.savedTime || 0;
      const currentDuration =
        duration || itemList[itemIndex]?.duration || "00:00:00";

      const itemInfo: ItemInfo =
        itemIndex === -1
          ? {
              anime: item.title,
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
      localStorage.setItem("animeInfo", JSON.stringify(itemList));

      setVideoState((prevState) => ({ ...prevState, isLoading: false }));
      return itemInfo;
    },
    [item]
  );

  const onProviderSetup = useCallback(
    (provider: MediaProviderAdapter) => {
      if (isVideoProvider(provider) && isHTMLVideoElement(provider.video)) {
        const player = provider.video;
        playerRef.current = player;

        player.oncanplaythrough = () => {
          const { itemList, itemIndex } = getItemListAndIndex();
          if (
            itemIndex !== -1 &&
            player.currentTime !== itemList[itemIndex].savedTime
          ) {
            player.currentTime = itemList[itemIndex].savedTime;
          }

          const duration = new Date(player.duration * 1000)
            .toISOString()
            .substring(11, 19);
          updateItemInfo(itemList, itemIndex, undefined, duration);
        };

        player.ontimeupdate = () => {
          const currentSecond = Math.round(player.currentTime);
          const { itemList, itemIndex } = getItemListAndIndex();
          if (
            itemIndex !== -1 &&
            currentSecond !== itemList[itemIndex].savedTime &&
            currentSecond > 0
          ) {
            updateItemInfo(itemList, itemIndex, currentSecond);
          }
        };
      }
    },
    [getItemListAndIndex, updateItemInfo]
  );

  useEffect(() => {
    const { itemList, itemIndex } = getItemListAndIndex();
    if (itemIndex !== -1) {
      const savedTime = itemList[itemIndex].savedTime;
      updateItemInfo(itemList, itemIndex, savedTime);
    } else {
      setVideoState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, [
    item.title,
    item.season,
    item.episode,
    getItemListAndIndex,
    updateItemInfo,
  ]);

  useEffect(() => {
    lastItemRef.current = item;
  }, [item]);

  const thumbnailSrc = useMemo(
    () =>
      `/api/image?type=thumbnail&path=${item.title}/anime/Season${seasonNumber
        .toString()
        .padStart(2, "0")}/${seasonNumber}-${episodeNumber}.webp`,
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
            className="w-full h-full object-contain">
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
