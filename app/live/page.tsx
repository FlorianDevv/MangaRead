import Image from "next/image";
// import { MediaPlayer, MediaProvider } from "@vidstack/react";
// import {
//   DefaultAudioLayout,
//   DefaultVideoLayout,
//   defaultLayoutIcons,
// } from "@vidstack/react/player/layouts/default";
// import "@vidstack/react/player/styles/default/layouts/video.css";
// import "@vidstack/react/player/styles/default/theme.css";
import { GET } from "@/app/api/live/route";
type ScheduleItem = {
  title: string;
  season: number;
  episode: number;
  start: number;
  startTime: number;
  realStartTime: number;
  duration: number;
};

export default async function Page() {
  const schedule: ScheduleItem[] = await GET();

  return (
    <div>
      <div className="flex overflow-x-auto ">
        {schedule
          .filter((item) => Date.now() <= item.realStartTime)
          .map((item, index) => (
            <div
              className="flex-none w-64 border m-2 p-4 flex flex-col items-center"
              key={index}
            >
              <div className="size-24 mb-8">
                <Image
                  src={`/${item.title}/anime/Season01/01-001.webp`}
                  alt={item.title}
                  width={500}
                  height={500}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="font-bold text-lg mb-2 text-center mt-4">
                {item.title}
              </div>
              <div className="text-base mb-2">Season: {item.season}</div>
              <div className="text-base mb-2">Episode: {item.episode}</div>
              <div className="text-base mb-2">Start: {item.startTime} h</div>
              {index === 0 && (
                <div className="text-base mb-2 text-red-500">LIVE</div>
              )}
              {/* <div className="text-base">Duration: {item.duration}</div> */}
            </div>
          ))}
      </div>
      {/* <MediaPlayer
        src={{ src: "/api/live", type: "video/mp4" }}
        playsInline
        streamType="live"
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
        <DefaultAudioLayout icons={defaultLayoutIcons} />
      </MediaPlayer> */}
    </div>
  );
}
