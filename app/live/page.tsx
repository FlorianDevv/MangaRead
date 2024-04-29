"use client";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
export default function Page() {
  return (
    <div>
      <h1>Live</h1>

      <MediaPlayer
        src={{ src: "/api/live", type: "video/mp4" }}
        playsInline
        streamType="live"
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
        <DefaultAudioLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
