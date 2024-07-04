import { MobileNavbarComponent } from "@/app/components/navbar/mobilenavbar";
import EpisodeSelect from "@/app/components/select/episodeselect";
import { SeasonSelect } from "@/app/components/select/seasonselect";
import { getDetails } from "@/app/types/getDetails";
import React, { Suspense } from "react";
const Player = React.lazy(() => import("../../../../components/player"));

interface Props {
	params: { slug: string; season: string; episode: string };
}

interface Metadata {
	title: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return {
		title: `${decodeURIComponent(params.slug)}`,
	};
}

export default async function Page({ params }: Props) {
	const details = await getDetails(decodeURIComponent(params.slug));

	if (
		!details ||
		(Array.isArray(details)
			? details.length === 0
			: (details.seasons ?? []).length === 0)
	) {
		return (
			<div>
				<h1>Error 404</h1>
			</div>
		);
	}

	const detailsArray = Array.isArray(details) ? details : [details];
	const seasons = detailsArray.flatMap((detail) => detail.seasons);

	const seasonNumber = params.season.replace(/\D/g, ""); // Remove non-digit characters
	const seasonNumberInt = Number.parseInt(seasonNumber); // Convert to number
	const seasonDetails = seasons?.find(
		(s) => s && Number.parseInt(s.season) === seasonNumberInt,
	);
	const episodes = seasonDetails?.episodes.map((episode: number) => ({
		name: episode.toString(),
	}));
	const seasonsWithName = seasons.map((season) => ({
		name: season?.season ?? "",
	}));

	return (
		<MobileNavbarComponent>
			<div className="flex flex-col items-center ">
				<h1 className="text-center text-3xl my-4">
					{decodeURIComponent(params.slug)}
				</h1>
				<div className="flex flex-wrap items-center">
					<EpisodeSelect
						episodes={episodes || []}
						slug={params.slug}
						currentEpisode={params.episode}
						season={params.season}
						isPage={true}
					/>
					<SeasonSelect
						seasons={seasonsWithName || []}
						slug={params.slug}
						currentSeason={params.season}
						isPage={true}
					/>
				</div>
				<Suspense fallback={<div>...</div>}>
					<Player
						title={params.slug}
						season={params.season}
						episode={params.episode}
						episodes={episodes ?? []}
						seasons={seasons as any}
					/>
				</Suspense>
			</div>
		</MobileNavbarComponent>
	);
}
