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

	const formatEpisodeNameRoute = (episodeNumber: string) => {
		const match = episodeNumber.match(/episode(\d+)/i);
		if (match) {
			const [, episode] = match;
			return `${Number.parseInt(episode)}`;
		}
		return episodeNumber;
	};

	const [selectedEpisode, setSelectedEpisode] = useState(
		formatEpisodeNameRoute(currentEpisode),
	);
	const handleChange = (value: string) => {
		const paddedValue = value.padStart(2, "0");
		setSelectedEpisode(`episode${paddedValue}`);
		router.push(`/anime/${slug}/${season}/episode${paddedValue}`);
	};

	const formatEpisodeName = (episodeNumber: string) => {
		return `${data.episodeSelect.episode} ${Number.parseInt(episodeNumber)}`;
	};

	const formatCurrentEpisodeName = (slug: string) => {
		const match = slug.match(/episode(\d+)/i);
		if (match) {
			const [, episode] = match;
			return `${data.episodeSelect.episode} ${Number.parseInt(episode)}`;
		}
		return slug;
	};

	const getNextEpisode = () => {
		const currentEpisodeIndex = episodes.findIndex(
			(episode) => formatEpisodeNameRoute(episode.name) === selectedEpisode,
		);
		const nextEpisodeIndex = currentEpisodeIndex + 1;
		if (nextEpisodeIndex < episodes.length) {
			const nextEpisodeNumber = formatEpisodeNameRoute(
				episodes[nextEpisodeIndex].name,
			);
			return `episode${nextEpisodeNumber.padStart(2, "0")}`;
		}
		return null;
	};

	const getPreviousEpisode = () => {
		const currentEpisodeIndex = episodes.findIndex(
			(episode) => formatEpisodeNameRoute(episode.name) === selectedEpisode,
		);
		const previousEpisodeIndex = currentEpisodeIndex - 1;
		if (previousEpisodeIndex >= 0) {
			const previousEpisodeNumber = formatEpisodeNameRoute(
				episodes[previousEpisodeIndex].name,
			);
			return `episode${previousEpisodeNumber.padStart(2, "0")}`;
		}
		return null;
	};

	const nextEpisode = getNextEpisode();
	const previousEpisode = getPreviousEpisode();
	return (
		<div className="flex items-center space-x-2">
			<>
				{previousEpisode ? (
					<Link href={`/anime/${slug}/${season}/${previousEpisode}`}>
						<Button variant="secondary">{data.episodeSelect.previous}</Button>
					</Link>
				) : (
					<Button variant="secondary" disabled>
						{data.episodeSelect.previous}
					</Button>
				)}
				{nextEpisode ? (
					<Link href={`/anime/${slug}/${season}/${nextEpisode}`}>
						<Button variant="secondary">{data.episodeSelect.next}</Button>
					</Link>
				) : (
					<Button variant="secondary" disabled>
						{data.episodeSelect.next}
					</Button>
				)}
			</>

			<Select
				name={data.episodeSelect.episode}
				value={selectedEpisode}
				onValueChange={handleChange}
			>
				<SelectTrigger
					className="rounded-md text-center hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
					aria-label={`Change episode. Currently on episode ${formatCurrentEpisodeName(
						currentEpisode,
					)}`}
				>
					{formatCurrentEpisodeName(currentEpisode)}
				</SelectTrigger>
				<SelectContent>
					{episodes
						.filter((episode) => !episode.name.endsWith(".webp"))
						.sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name))
						.map((episode) => (
							<SelectItem key={episode.name} value={episode.name}>
								{formatEpisodeName(episode.name)}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
		</div>
	);
}
