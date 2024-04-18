"use client";
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function Player() {
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);

  const handlePlayPause = useCallback(() => {
    setPlaying((prevPlaying) => !prevPlaying);
    setShowPlayPauseIcon(true);
  }, [setPlaying]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPlayedSeconds(value);
    if (playerRef.current) {
      playerRef.current.seekTo(value);
    }
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(Math.round(state.playedSeconds));
  };

  const handleDuration = (duration: number) => {
    setDuration(Math.round(duration));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePlayPause]);

  useEffect(() => {
    if (showPlayPauseIcon) {
      const timeoutId = setTimeout(() => {
        setShowPlayPauseIcon(false);
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [showPlayPauseIcon]);

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return [h, m > 9 ? m : h > 0 ? "0" + m : m || "0", s > 9 ? s : "0" + s]
      .filter(Boolean)
      .join(":");
  }

  return (
    <div
      className="relative aspect-16/9 h-screen"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={handlePlayPause}
        className="absolute top-0 left-0 w-full h-full"
      >
        <ReactPlayer
          ref={playerRef}
          className="absolute top-0 left-0"
          url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
          width="100%"
          height="100%"
          playing={playing}
          onProgress={handleProgress}
          onDuration={handleDuration}
        />
        {showPlayPauseIcon && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500">
            {playing ? (
              <div className="bg-gray-700 bg-opacity-50 rounded-full p-2">
                <Play style={{ width: "60px", height: "60px" }} />
              </div>
            ) : (
              <div className="bg-gray-700 bg-opacity-50 rounded-full p-2">
                <Pause style={{ width: "60px", height: "60px" }} />
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full flex items-center transition-all duration-500 ease-in-out ${
          hovered ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {playing ? (
          <Pause onClick={handlePlayPause} className="text-4xl mr-4" />
        ) : (
          <Play onClick={handlePlayPause} className="text-4xl mr-4" />
        )}
        <input
          type="range"
          min={0}
          max={duration}
          value={playedSeconds}
          onChange={handleSeekChange}
          className="w-full appearance-none bg-gray-400 h-1 rounded-full mx-4"
        />

        <span className="text-sm flex flex-row flex-nowrap">{`${formatTime(
          playedSeconds
        )}/${formatTime(duration)}`}</span>
      </div>
    </div>
  );
}
