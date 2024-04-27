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

type Season = {
  name: string;
};

export function SeasonSelect({
  seasons,
  slug,
  currentSeason,
  isPage,
}: {
  seasons: Season[];
  slug: string;
  currentSeason: string;
  isPage: boolean;
}) {
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
  const [selectedSeason, setSelectedSeason] = useState(currentSeason || "");
  const router = useRouter();
  const handleChange = (value: string) => {
    setSelectedSeason(value);
    const season = seasons.find(
      (season) => season.name.toLowerCase() === value.toLowerCase()
    );
    if (season) {
      router.push(`/anime/${slug}/${season.name.toLowerCase()}/episode01`);
    }
  };
  const formatSeasonName = (filename: string) => {
    const match = filename.match(/Season(\d+)/);
    if (match) {
      const [, season] = match;
      return `${data.seasonSelect.season} ${season.padStart(2, "0")}`;
    }
    return filename;
  };

  const formatCurrentSeasonName = (slug: string) => {
    const match = slug.match(/Season(\d+)/i);
    if (match) {
      const [, season] = match;
      return `${data.seasonSelect.season} ${season.padStart(2, "0")}`;
    }
    return slug;
  };

  return (
    <div className="flex flex-row">
      <Select
        name={data.seasonSelect.season}
        value={formatCurrentSeasonName(currentSeason)}
        onValueChange={handleChange}
      >
        <SelectTrigger
          className="mx-2 shadow-md rounded-md overflow-hidden max-w-sm p-2 text-center hover:opacity-75 focus:outline-none ease-in-out transition-opacity duration-300 cursor-pointer w-auto"
          aria-label={`Change season. Currently on ${formatCurrentSeasonName(
            currentSeason
          )}`}
        >
          {formatCurrentSeasonName(currentSeason)}
        </SelectTrigger>
        <SelectContent>
          {seasons
            .sort((a, b) => {
              const seasonANumber = parseInt(a.name.replace("Season ", ""));
              const seasonBNumber = parseInt(b.name.replace("Season ", ""));
              return seasonANumber - seasonBNumber;
            })
            .map((season, index) => (
              <SelectItem key={index} value={season.name}>
                {formatSeasonName(season.name)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {!isPage && (
        <Link href={`/anime/${slug}/season01/episode01`}>
          <Button variant="secondary" className="uppercase">
            {data.episodeSelect.start}
          </Button>
        </Link>
      )}
    </div>
  );
}
