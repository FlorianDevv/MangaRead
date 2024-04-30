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
import { useCallback, useEffect, useState } from "react";

export default function PlayerLive() {
  const [src, setSrc] = useState("");
  const [prevSrc, setPrevSrc] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchVideoData = useCallback(async () => {
    const currentResponse = await fetch("/api/live/current");
    const currentData = await currentResponse.json();

    const currentSrc = `/api/video?videoId=${`${
      currentData.title
    }/anime/Season${String(currentData.season).padStart(2, "0")}/${String(
      currentData.season
    ).padStart(2, "0")}-${String(currentData.episode).padStart(3, "0")}.mp4`}`;

    setSrc(currentSrc);
    if (currentSrc !== prevSrc) {
      setElapsedTime(0);
      setPrevSrc(currentSrc);
    } else {
      setElapsedTime(currentData.elapsedTime);
    }

    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.currentTime = elapsedTime;
    }

    return { elapsedTime: currentData.elapsedTime };
  }, [prevSrc, elapsedTime]);

  useEffect(() => {
    const fetchAndStartVideo = async () => {
      const { elapsedTime } = await fetchVideoData();
      const videoElement = document.querySelector("video");
      if (videoElement) {
        videoElement.currentTime = elapsedTime;
      }
    };

    fetchAndStartVideo();
    setIsFirstLoad(false);
  }, [fetchVideoData]);

  const handleVideoEnd = async () => {
    // console.log("Video ended. Switching to next video");
    await fetchVideoData();
  };

  const onProviderSetup = useCallback(
    (provider: MediaProviderAdapter) => {
      if (isVideoProvider(provider) && isHTMLVideoElement(provider.video)) {
        const player = provider.video;

        player.onloadedmetadata = () => {
          player.currentTime = elapsedTime;
        };
      }
    },
    [elapsedTime]
  );

  return (
    <div className="fixed top-0 left-0 h-screen w-screen z-50">
      <MediaPlayer
        key={src}
        src={{ src: src, type: "video/mp4" }}
        playsInline
        onProviderSetup={onProviderSetup}
        onEnded={handleVideoEnd}
        autoPlay
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
        <DefaultAudioLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
