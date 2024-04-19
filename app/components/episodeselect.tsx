"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Episode = {
  name: string;
};

export default function EpisodeSelect({
  episodes,
  slug,
  currentEpisode,
  season,
  isPage,
}: {
  episodes: Episode[];
  slug: string;
  season: string;
  currentEpisode: string;
  isPage: boolean;
}) {
  const [selectedEpisode, setSelectedEpisode] = useState(currentEpisode || "");
  const router = useRouter();

  const handleChange = (value: string) => {
    setSelectedEpisode(value);
    const episode = episodes.find((episode) => episode.name === value);
    if (episode) {
      router.push(
        `/anime/${slug}/${season}/${formatEpisodeNameRoute(episode.name)}`
      );
    }
  };
  const formatEpisodeNameRoute = (filename: string) => {
    const match = filename.match(/(\d+)-(\d+)\.mp4/);
    if (match) {
      const [, , episode] = match;
      const episodeNumber = parseInt(episode);
      const formattedEpisodeNumber =
        episodeNumber < 10 ? `0${episodeNumber}` : `${episodeNumber}`;
      return `episode${formattedEpisodeNumber}`;
    }
    return filename;
  };
  const formatEpisodeName = (filename: string) => {
    const match = filename.match(/(\d+)-(\d+)\.mp4/);
    if (match) {
      const [, , episode] = match;
      return `Episode ${parseInt(episode)}`;
    }
    return filename;
  };
  const formatCurrentEpisodeName = (slug: string) => {
    const match = slug.match(/episode(\d+)/i);
    if (match) {
      const [, episode] = match;
      return `Episode ${parseInt(episode)}`;
    }
    return slug;
  };

  const filteredEpisodes = episodes.filter(
    (episode) => !episode.name.endsWith(".webp")
  );

  return (
    <Select
      name="episode"
      value={formatCurrentEpisodeName(currentEpisode)}
      onValueChange={handleChange}
    >
      <SelectTrigger
        className="mx-2 shadow-md rounded-md overflow-hidden max-w-sm p-2 text-center hover:opacity-75 focus:outline-none ease-in-out transition-opacity duration-300 cursor-pointer w-auto"
        aria-label={`Change episode. Currently on episode ${formatCurrentEpisodeName(
          currentEpisode
        )}`}
      >
        {formatCurrentEpisodeName(currentEpisode)}
      </SelectTrigger>
      <SelectContent>
        {filteredEpisodes
          .sort((a, b) => {
            const episodeANumber = parseInt(a.name.replace("Episode ", ""));
            const episodeBNumber = parseInt(b.name.replace("Episode ", ""));
            return episodeANumber - episodeBNumber;
          })
          .map((episode, index) => (
            <SelectItem key={index} value={episode.name}>
              {formatEpisodeName(episode.name)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
