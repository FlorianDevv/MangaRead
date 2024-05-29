// AnimeComponent.tsx
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CirclePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
type Season = {
  name: string;
};

type Episode = {
  name: string;
  seasonNumber: string;
  episodeNumber: string;
};
interface AnimeComponentProps {
  seasons: Season[];
  episodes: Episode[];
  slug: string;
}

const AnimeEpisode: React.FC<AnimeComponentProps> = ({
  seasons,
  episodes,
  slug,
}) => {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]?.name || "");

  const seasonNumber = selectedSeason.match(/\d+/)?.[0] || "";
  const filteredEpisodes = episodes.filter(
    (episode) => episode.seasonNumber.match(/\d+/)?.[0] === seasonNumber
  );

  const handleChange = (value: string) => {
    setSelectedSeason(value);
  };

  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);

  console.log(filteredEpisodes);
  console.log(selectedSeason);
  console.log(episodes);
  console.log(seasons);

  return (
    <div className="p-2 rounded-md">
      <div className="flex flex-col justify-start items-start">
        <h1 className="inline-block bg-red-900 text-lg py-1 rounded p-4 m-2 ">
          Anime
        </h1>
        <div className="inline-block p-2">
          <Select
            name={selectedSeason}
            value={selectedSeason}
            onValueChange={handleChange}
          >
            <SelectTrigger
              className=" rounded-md text-center hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
              aria-label={`Change season. Currently on season ${selectedSeason}`}
            >
              {`${data.seasonSelect.season} ${parseInt(
                selectedSeason.substring(6)
              )}`}
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season, index) => (
                <SelectItem key={index} value={season.name}>
                  {`${data.seasonSelect.season} ${parseInt(
                    season.name.substring(6)
                  )}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 justify-items-center items-center">
        {filteredEpisodes.map((episode, index) => (
          <Link
            href={`/anime/${slug}/${selectedSeason.toLowerCase()}/episode${
              episode.episodeNumber.length === 3
                ? episode.episodeNumber.slice(1)
                : episode.episodeNumber
            }`}
            key={index}
          >
            <div
              key={index}
              className="relative rounded p-4 hover:opacity-75 hover:bg-[#2b2b2b] ease-in-out transition-opacity duration-300"
            >
              <Image
                src={`/${slug}/anime/Season${seasonNumber.padStart(
                  2,
                  "0"
                )}/${seasonNumber.padStart(
                  2,
                  "0"
                )}-${episode.episodeNumber.padStart(3, "0")}.webp`}
                alt={episode.name}
                width={300}
                height={300}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full transition-transform duration-200 hover:scale-110">
                <CirclePlay className="w-14 h-14 text-white " />
              </div>
              <p className="text-xs mt-2">
                {parseInt(episode.episodeNumber)}. {data.episodeSelect.episode}{" "}
                {parseInt(episode.episodeNumber)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AnimeEpisode;
