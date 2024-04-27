"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Link from "next/link";
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
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
  const router = useRouter();

  const handleChange = (value: string) => {
    const episode = episodes.find((episode) => episode.name === value);
    if (!isPage) {
      season = "season01";
    }
    if (episode) {
      const formattedName = formatEpisodeNameRoute(episode.name);
      setSelectedEpisode(formattedName);
      router.push(`/anime/${slug}/${season}/${formattedName}`);
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
  const [selectedEpisode, setSelectedEpisode] = useState(
    formatEpisodeNameRoute(currentEpisode || "")
  );
  const formatEpisodeName = (filename: string) => {
    const match = filename.match(/(\d+)-(\d+)\.mp4/);
    if (match) {
      const [, , episode] = match;
      return `${data.episodeSelect.episode} ${parseInt(episode)}`;
    }
    return filename;
  };
  const formatCurrentEpisodeName = (slug: string) => {
    const match = slug.match(/episode(\d+)/i);
    if (match) {
      const [, episode] = match;
      return `${data.episodeSelect.episode} ${parseInt(episode)}`;
    }
    return slug;
  };

  const filteredEpisodes = episodes.filter(
    (episode) => !episode.name.endsWith(".webp")
  );
  const getNextEpisode = () => {
    const currentEpisodeIndex = filteredEpisodes.findIndex(
      (episode) => formatEpisodeNameRoute(episode.name) === selectedEpisode
    );
    const nextEpisodeIndex = currentEpisodeIndex + 1;
    if (nextEpisodeIndex < filteredEpisodes.length) {
      return formatEpisodeNameRoute(filteredEpisodes[nextEpisodeIndex].name);
    }
    return null;
  };

  const getPreviousEpisode = () => {
    const currentEpisodeIndex = filteredEpisodes.findIndex(
      (episode) => formatEpisodeNameRoute(episode.name) === selectedEpisode
    );
    const previousEpisodeIndex = currentEpisodeIndex - 1;
    if (previousEpisodeIndex >= 0) {
      return formatEpisodeNameRoute(
        filteredEpisodes[previousEpisodeIndex].name
      );
    }
    return null;
  };
  const nextEpisode = getNextEpisode();
  const previousEpisode = getPreviousEpisode();

  return (
    <div className="flex items-center space-x-2">
      {isPage && (
        <>
          {previousEpisode ? (
            <Link
              href={`/anime/${slug}/${season}/${formatEpisodeNameRoute(
                previousEpisode
              )}`}
            >
              <Button variant="secondary">{data.episodeSelect.previous}</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              {data.episodeSelect.previous}
            </Button>
          )}
          {nextEpisode ? (
            <Link
              href={`/anime/${slug}/${season}/${formatEpisodeNameRoute(
                nextEpisode
              )}`}
            >
              <Button variant="secondary">{data.episodeSelect.next}</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              {data.episodeSelect.next}
            </Button>
          )}
        </>
      )}
      <Select
        name={data.episodeSelect.episode}
        value={formatCurrentEpisodeName(currentEpisode)}
        onValueChange={handleChange}
      >
        <SelectTrigger
          className=" rounded-md text-center hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
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
    </div>
  );
}
