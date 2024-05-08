"use client";
import styles from "@/app/playerlive.module.css";
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
  const [title, setTitle] = useState("");
  const [episode, setEpisode] = useState(0);
  const [season, setSeason] = useState(0);

  const fetchVideoData = useCallback(async () => {
    const currentResponse = await fetch("/api/live/current");
    const currentData = await currentResponse.json();

    const currentSrc = `/api/video?videoId=${`${
      currentData.title
    }/anime/Season${String(currentData.season).padStart(2, "0")}/${String(
      currentData.season
    ).padStart(2, "0")}-${String(currentData.episode).padStart(3, "0")}.mp4`}`;

    setSrc(currentSrc);
    setTitle(currentData.title);
    setEpisode(currentData.episode);
    setSeason(currentData.season);

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

  const onProviderSetup: any = useCallback(
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

  const handlePlay = async () => {
    const { elapsedTime } = await fetchVideoData();
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.currentTime = elapsedTime;
    }
  };
  return (
    <MediaPlayer
      key={src}
      src={{ src: src, type: "video/mp4" }}
      onProviderSetup={onProviderSetup}
      onEnded={handleVideoEnd}
      autoPlay
      playsInline
      keyDisabled
      onPlay={handlePlay}
      controls={false}
      title={title + " - S" + season + " E" + episode}
      className={`${styles.player} ${styles["vds-video-layout"]}`}
    >
      <MediaProvider />
      <DefaultVideoLayout
        disableTimeSlider={true}
        noKeyboardAnimations={true}
        noGestures={true}
        noScrubGesture={true}
        icons={defaultLayoutIcons}
        className={`${styles.player} ${styles["vds-video-layout"]}`}
      />
      <DefaultAudioLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
