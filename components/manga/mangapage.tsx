"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { FloatingButton } from "../floatingButtons";
import { MobileNavbarComponent } from "../navbar/mobilenavbar";
import { NavbarContext } from "../navbar/navbarcontext";
import { Quality, Read, getSettings } from "../settings";
import { NextPageButton, PreviousPageButton } from "./buttonPage";
import Fullscreen from "./fullscreen";
import SelectPageNumber from "./selectPageNumber";
import { usePageState } from "./usePageState";
type Volume = {
	name: string;
	totalPages: number;
	type?: string;
};

type MangaPageProps = {
	slug: string;
	volume: string;
	initialPageNumber: number;
	totalPages: number;
	volumes: Volume[];
};

export default function MangaPage({
	slug,
	volume,
	initialPageNumber,
	totalPages,
	volumes,
}: MangaPageProps) {
	const {
		pageNumber,
		setPageNumber,
		isLoading,
		setIsLoading,
		nextPageExists,
		nextPage,
		previousPage,
	} = usePageState(initialPageNumber, totalPages, volumes, slug);

	const formattedVolume = String(volume).padStart(2, "0");
	const { read } = getSettings();
	const [isVertical, setIsVertical] = useState(read === "vertical");
	const VolumeTome = `Tome ${formattedVolume}`;
	const { qualityNumber } = getSettings();
	const [quality, setQuality] = useState(qualityNumber);
	const [isFullscreen, setIsFullscreen] = useState(false);
	useEffect(() => {
		const handleSettingsChange = () => {
			const { read } = getSettings();
			setIsVertical(read === "vertical");
		};

		// Listen for the custom event
		window.addEventListener("settingsUpdated", handleSettingsChange);

		// Cleanup function
		return () => {
			window.removeEventListener("settingsUpdated", handleSettingsChange);
		};
	}, []);

	useEffect(() => {
		const handleSettingsChange = () => {
			const { qualityNumber: newQuality } = getSettings();
			setQuality(newQuality);
		};

		window.addEventListener("settingsUpdated", handleSettingsChange);

		return () => {
			window.removeEventListener("settingsUpdated", handleSettingsChange);
		};
	}, []);

	const currentPath = usePathname();

	const getNextVolume = useCallback(() => {
		const currentVolumeFromUrl = currentPath.split("/").pop();
		const nextVolume = (
			Number.parseInt(currentVolumeFromUrl || "0", 10) + 1
		).toString();

		const nextVolumeExists = volumes.some(
			(volume) => volume.name === nextVolume,
		);

		return nextVolumeExists ? nextVolume : false;
	}, [currentPath, volumes]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (isVertical) {
				return;
			}

			switch (event.key) {
				case "ArrowLeft":
					previousPage();
					break;
				case "ArrowRight":
					nextPage();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [previousPage, nextPage, isVertical]);
	useEffect(() => {
		let existingMangaInfo = JSON.parse(
			localStorage.getItem("mangaInfo") || "[]",
		);

		if (!Array.isArray(existingMangaInfo)) {
			existingMangaInfo = [];
		}

		const existingMangaIndex = existingMangaInfo.findIndex(
			(info: { manga: string }) => info.manga === slug,
		);

		const mangaInfo = {
			manga: slug,
			volume: volume,
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
	}, [slug, volume, pageNumber, totalPages, volumes]);

	const formattedPageNumber = String(pageNumber).padStart(3, "0");
	const formattedVolumeNumber = String(volume).padStart(2, "0");
	const imageName = `${formattedVolumeNumber}-${formattedPageNumber}`;
	const images = Array.from({ length: totalPages }, (_, i) => {
		const pageNumber = i + 1;
		if (Number.isNaN(pageNumber)) {
			return;
		}

		return `${formattedVolumeNumber}-${String(pageNumber).padStart(3, "0")}`;
	});
	const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		if (isVertical) {
			setIsLoading(true);
			// Scroll to the image corresponding to pageNumber when switching to vertical mode
			imageRefs.current[pageNumber - 1]?.scrollIntoView();
		}
	}, [isVertical, pageNumber, setIsLoading]);

	const nextFormattedPageNumber = String(pageNumber + 1).padStart(3, "0");
	const nextImageName = `${formattedVolumeNumber}-${nextFormattedPageNumber}`;

	const nextNextFormattedPageNumber = String(pageNumber + 2).padStart(3, "0");
	const nextNextImageName = `${formattedVolumeNumber}-${nextNextFormattedPageNumber}`;

	const [isVisible, setIsVisible] = useState(true);
	useEffect(() => {
		if (!isVertical) {
			setIsVisible(true);
		}
	}, [isVertical]);
	useEffect(() => {
		const handleScroll = () => {
			if (isVertical) {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isVertical]);
	const [isScrollingUp, setIsScrollingUp] = useState(false);
	const lastScrollY = useRef(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.pageYOffset;
			setIsScrollingUp(lastScrollY.current > currentScrollY);
			lastScrollY.current = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return (
		<NavbarContext.Provider value={{ isVisible, setIsVisible }}>
			<MobileNavbarComponent>
				<>
					<div className="flex justify-center ">
						{SelectPageNumber(pageNumber, setPageNumber, totalPages)}
						<Fullscreen
							isFullscreen={isFullscreen}
							setIsFullscreen={setIsFullscreen}
						/>
					</div>
					<div className="flex justify-center space-x-4 ">
						<Quality qualityNumber={quality} setQuality={setQuality} />
						<Read isVertical={isVertical} setIsVertical={setIsVertical} />
					</div>
					<div className="relative min-h-screen w-screen mt-2">
						{!isVertical && (
							<Image
								src={`/api/image?path=${slug}/manga/${VolumeTome}/${imageName}.webp`}
								alt={`${slug} Page ${pageNumber}`}
								className="object-contain"
								quality={quality}
								priority={true}
								fill
								onLoad={() => setIsLoading(false)}
								placeholder="blur"
								blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
							/>
						)}
						{isLoading && !isVertical && (
							<div className="loading-screen">
								<div className="spinner" />
							</div>
						)}
						{nextPageExists && !isVertical && (
							<>
								<Image
									src={`/api/image?path=${slug}/manga/${VolumeTome}/${nextImageName}.webp`}
									alt={`${slug} Page ${pageNumber + 1}`}
									quality={quality}
									fill
									priority={true}
									className="hidden object-contain"
									placeholder="blur"
									blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
								/>
								{pageNumber + 2 <= totalPages && (
									<Image
										src={`/api/image?path=${slug}/manga/${VolumeTome}/${nextNextImageName}.webp`}
										alt={`${slug} Page ${pageNumber + 2}`}
										quality={quality}
										fill
										priority={true}
										className="hidden object-contain"
										placeholder="blur"
										blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
									/>
								)}
							</>
						)}
						<div className="flex flex-col">
							{isVertical && (
								<>
									{images.map((imageName, index) => (
										<div
											key={imageName}
											ref={(ref: HTMLDivElement | null) => {
												if (ref) {
													imageRefs.current[index] = ref;
												}
											}}
										>
											<Image
												id={`image-${index}`}
												src={`/api/image?path=${slug}/manga/${VolumeTome}/${imageName}.webp`}
												alt={`${slug} Page ${index + 1}`}
												width={3840}
												height={2160}
												quality={quality}
												loading="lazy"
												placeholder="blur"
												blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
												onLoad={() => {
													if (index + 1 === pageNumber && isLoading) {
														imageRefs.current[index]?.scrollIntoView();
														setIsLoading(false);
													}
												}}
												onClick={async () => {
													setPageNumber(index + 1);
													await new Promise((resolve) =>
														setTimeout(resolve, 10),
													);
													setIsLoading(false);
													setTimeout(() => setIsVisible(true), 10);
												}}
												className={
													isFullscreen
														? "object-contain"
														: "mx-auto lg:max-w-screen-lg object-contain"
												}
											/>
										</div>
									))}
									{isLoading && (
										<div className="loading-screen">
											<div className="spinner" />
										</div>
									)}

									<FloatingButton
										className={`transition-all ease-in-out duration-300 transform ${
											isScrollingUp
												? "translate-y-0 opacity-100"
												: "translate-y-10 opacity-0"
										}`}
										qualityNumber={quality || 0}
										setQuality={setQuality}
										setIsVertical={setIsVertical}
										isVertical={isVertical}
										volumes={volumes.map((volume) => ({
											...volume,
											type: volume.type || "",
										}))}
										slug={slug}
										currentVolume={decodeURIComponent(volume)}
										isFullscreen={isFullscreen}
										setIsFullscreen={setIsFullscreen}
									/>
								</>
							)}
						</div>
						{pageNumber > 1 && !isVertical && (
							<PreviousPageButton previousPage={previousPage} />
						)}
						{!isVertical && (
							<NextPageButton nextPage={nextPage} disabled={isLoading} />
						)}
					</div>
				</>
			</MobileNavbarComponent>
		</NavbarContext.Provider>
	);
}
