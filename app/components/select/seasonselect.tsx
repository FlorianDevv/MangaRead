"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Season = {
	name: string;
};

export function SeasonSelect({
	seasons,
	slug,
	currentSeason,
}: {
	seasons: Season[];
	slug: string;
	currentSeason: string;
	isPage: boolean;
}) {
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);
	const router = useRouter();

	const formatSeasonNameRoute = (seasonName: string) => {
		const number = Number.parseInt(seasonName.replace(/season/i, ""));
		return `${number}`;
	};

	const [selectedSeason, setSelectedSeason] = useState(
		formatSeasonNameRoute(currentSeason),
	);

	const handleChange = (value: string) => {
		setSelectedSeason(value);
		router.push(`/anime/${slug}/season${value.padStart(2, "0")}/episode01`);
	};

	const formatSeasonName = (seasonNumber: string) => {
		return `${data.seasonSelect.season} ${Number.parseInt(seasonNumber)}`;
	};

	const formatCurrentSeasonName = (slug: string) => {
		const match = slug.match(/Season(\d+)/i);
		if (match) {
			const [, season] = match;
			return `${data.seasonSelect.season} ${Number.parseInt(season)}`;
		}
		return slug;
	};

	return (
		<div className="flex flex-row">
			<Select
				name={data.seasonSelect.season}
				value={selectedSeason}
				onValueChange={handleChange}
			>
				<SelectTrigger
					className="mx-2  max-w-sm p-2 text-center  w-auto"
					aria-label={`Change season. Currently on ${formatCurrentSeasonName(
						currentSeason,
					)}`}
				>
					{formatCurrentSeasonName(currentSeason)}
				</SelectTrigger>
				<SelectContent>
					{seasons
						.sort((a, b) => {
							const seasonANumber = Number.parseInt(
								a.name.replace("Season ", ""),
							);
							const seasonBNumber = Number.parseInt(
								b.name.replace("Season ", ""),
							);
							return seasonANumber - seasonBNumber;
						})
						.map((season) => (
							<SelectItem key={season.name} value={season.name}>
								{formatSeasonName(season.name)}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
		</div>
	);
}
