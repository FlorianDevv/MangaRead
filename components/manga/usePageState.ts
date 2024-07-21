import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
type Volume = {
	name: string;
	totalPages: number;
	type?: string;
};

export const usePageState = (
	initialPageNumber: number,
	totalPages: number,
	volumes: Volume[],
	slug: string,
) => {
	const [pageNumber, setPageNumber] = useState(initialPageNumber);
	const [isLoading, setIsLoading] = useState(true);
	const [nextPageExists, setNextPageExists] = useState(true);

	const router = useRouter();
	const pathname = usePathname();

	const getNextVolume = useCallback(() => {
		const currentVolumeFromUrl = pathname.split("/").pop();
		const nextVolume = (
			Number.parseInt(currentVolumeFromUrl || "0", 10) + 1
		).toString();
		return volumes.some((volume) => volume.name === nextVolume)
			? nextVolume
			: false;
	}, [pathname, volumes]);

	const nextPage = useCallback(() => {
		if (isLoading) return;
		if (pageNumber < totalPages) {
			setPageNumber(pageNumber + 1);
			setIsLoading(true);
		} else {
			const nextVolume = getNextVolume();
			if (nextVolume) {
				const parts = pathname.split("/");
				parts[parts.length - 1] = nextVolume;
				const newPathname = parts.join("/");
				router.push(newPathname);
			}
		}
	}, [pageNumber, totalPages, isLoading, getNextVolume, pathname, router]);

	const previousPage = useCallback(() => {
		if (pageNumber > 1) {
			setPageNumber(pageNumber - 1);
		}
	}, [pageNumber]);

	const checkNextPageExists = useCallback(() => {
		const nextPageNumber = pageNumber + 1;
		setNextPageExists(nextPageNumber <= totalPages);
	}, [pageNumber, totalPages]);

	useEffect(() => {
		checkNextPageExists();
	}, [checkNextPageExists]);

	useEffect(() => {
		let existingMangaInfo = JSON.parse(
			localStorage.getItem("mangaInfo") || "[]",
		);
		if (!Array.isArray(existingMangaInfo)) existingMangaInfo = [];

		const existingMangaIndex = existingMangaInfo.findIndex(
			(info: { manga: string }) => info.manga === slug,
		);

		const mangaInfo = {
			manga: slug,
			volume: volumes[0].name,
			page: pageNumber,
			totalPages: totalPages,
			type: volumes[0].type || "Volume",
			dateWatched:
				existingMangaInfo[existingMangaIndex]?.dateWatched || Date.now(),
		};

		if (existingMangaIndex !== -1) {
			existingMangaInfo[existingMangaIndex] = mangaInfo;
		} else {
			existingMangaInfo.push(mangaInfo);
		}

		localStorage.setItem("mangaInfo", JSON.stringify(existingMangaInfo));
	}, [slug, volumes, pageNumber, totalPages]);

	return {
		pageNumber,
		setPageNumber,
		isLoading,
		setIsLoading,
		nextPageExists,
		nextPage,
		previousPage,
	};
};
