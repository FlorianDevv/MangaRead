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
import type React from "react";
import { useState } from "react";
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
		(episode) => episode.seasonNumber.match(/\d+/)?.[0] === seasonNumber,
	);

	const handleChange = (value: string) => {
		setSelectedSeason(value);
	};

	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);

	return (
		<div className="p-2 rounded-md">
			<div className="flex flex-col justify-start items-start">
				<h1 className="inline-block bg-red-900 text-lg py-1 rounded p-4 m-2 text-white">
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
							{`${data.seasonSelect.season} ${Number.parseInt(
								selectedSeason.substring(6),
							)}`}
						</SelectTrigger>
						<SelectContent>
							{seasons.map((season) => (
								<SelectItem key={season.name} value={season.name}>
									{`${data.seasonSelect.season} ${Number.parseInt(
										season.name.substring(6),
									)}`}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 mt-4 justify-items-center items-center ">
				{filteredEpisodes.map((episode) => (
					<Link
						href={`/anime/${slug}/season${selectedSeason
							.replace(/season /i, "")
							.padStart(2, "0")}/episode${episode.episodeNumber.padStart(
							2,
							"0",
						)}`}
						key={episode.name}
					>
						<div
							key={episode.name}
							className="relative rounded p-4  hover:bg-accent ease-in-out transition-opacity duration-300"
						>
							<Image
								src={`/api/image?type=thumbnail&path=${slug}/anime/Season${seasonNumber.padStart(
									2,
									"0",
								)}/${seasonNumber.padStart(
									2,
									"0",
								)}-${episode.episodeNumber.padStart(3, "0")}.webp`}
								alt={episode.name}
								width={300}
								height={300}
								className="object-cover"
							/>
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white bg-opacity-50 rounded-full transition-transform duration-200 hover:scale-110">
								<CirclePlay size={30} />
							</div>
							<p className="text-xs mt-2">
								{Number.parseInt(episode.episodeNumber)}.{" "}
								{data.episodeSelect.episode}{" "}
								{Number.parseInt(episode.episodeNumber)}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default AnimeEpisode;
