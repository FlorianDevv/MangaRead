"use client";
import { useEffect, useState } from "react";
import MangaPage from "./mangapage";

interface Volume {
	name: string;
	totalPages: number;
	type: string;
}

interface CheckPageProps {
	params: { slug: string; volume: string };
	totalPages: number;
	volumes: Volume[];
}

export default function CheckPage({
	params,
	totalPages,
	volumes,
}: CheckPageProps) {
	const { slug, volume } = params;

	const getInitialPageNumber = () => {
		let pageNumber = 1;

		if (typeof window !== "undefined") {
			const storedState = localStorage.getItem("mangaInfo");
			if (storedState) {
				const mangaInfos = JSON.parse(storedState);
				if (Array.isArray(mangaInfos)) {
					const mangaInfo = mangaInfos.find(
						(info: { manga: string; volume: string }) =>
							info.manga === slug && info.volume === volume,
					);
					pageNumber = mangaInfo ? Number.parseInt(mangaInfo.page, 10) : 1;
				}
			}
		}
		return pageNumber;
	};

	const [initialPageNumber] = useState<number>(getInitialPageNumber());
	useEffect(() => {
		let mangaInfos = JSON.parse(localStorage.getItem("mangaInfo") || "[]");
		const mangaInfoIndex = mangaInfos.findIndex(
			(info: { manga: string; volume: string }) =>
				info.manga === slug && info.volume === volume,
		);

		if (mangaInfoIndex !== -1) {
			const updatedMangaInfo = mangaInfos[mangaInfoIndex];
			updatedMangaInfo.totalPages = totalPages;
			updatedMangaInfo.dateWatched = Date.now();
			mangaInfos = mangaInfos.filter(
				(_: { manga: string; volume: string }, index: number) =>
					index !== mangaInfoIndex,
			);
			mangaInfos.push(updatedMangaInfo);
		} else {
			mangaInfos.push({
				manga: slug,
				volume: volume,
				page: initialPageNumber,
				type: volumes[0].type,
				totalPages: totalPages,
				dateWatched: Date.now(),
			});
		}

		mangaInfos = mangaInfos.reverse();

		localStorage.setItem("mangaInfo", JSON.stringify(mangaInfos));
	}, [initialPageNumber, slug, totalPages, volume, volumes]);

	return (
		<MangaPage
			slug={slug}
			volume={volume}
			initialPageNumber={initialPageNumber}
			totalPages={totalPages}
			volumes={volumes}
		/>
	);
}
