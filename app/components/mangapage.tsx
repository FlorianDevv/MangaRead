"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
	use,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { FloatingButton } from "./floatingButtons";
import { MobileNavbarComponent } from "./navbar/mobilenavbar";
import { NavbarContext } from "./navbar/navbarcontext";
import { Quality, Read, getSettings } from "./settings";
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
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(initialPageNumber);
	const formattedVolume = String(volume).padStart(2, "0");
	const { read } = getSettings();
	const [isVertical, setIsVertical] = useState(read === "vertical");
	const VolumeTome = `Tome ${formattedVolume}`;
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

	const { qualityNumber } = getSettings();
	const [quality, setQuality] = useState(qualityNumber);

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
	const [nextPageExists, setNextPageExists] = useState(true);

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

	const router = useRouter();
	const pathname = usePathname();
	const nextPage = useCallback(() => {
		if (isLoading) {
			return;
		}
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
	const [isFullscreen, setIsFullscreen] = useState(false);
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
	}, [isVertical, pageNumber]);

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
												sizes="(min-width: 1080px) 1024px, 95.26vw"
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
//---------------------------------------------

interface FullscreenProps {
	isFullscreen: boolean;
	setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Utilisez le contexte dans le composant Fullscreen
export function Fullscreen({ isFullscreen, setIsFullscreen }: FullscreenProps) {
	const { setIsVisible } = useContext(NavbarContext);

	const goFullScreen = () => {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		}
		document.body.classList.add("fullscreen");
		setIsFullscreen(true);
		setIsVisible(false);
	};

	const exitFullScreen = () => {
		if (document.fullscreenElement && document.exitFullscreen) {
			document.exitFullscreen();
		}
		document.body.classList.remove("fullscreen");
		setIsFullscreen(false);
		setIsVisible(true);
	};

	return (
		<button
			type="button"
			className={
				"justify-center hover:scale-115 hover:opacity-75 transform transition-transform duration-300 "
			}
			onClick={isFullscreen ? exitFullScreen : goFullScreen}
			title="Fullscreen"
		>
			{isFullscreen ? <Minimize2 /> : <Maximize2 />}
		</button>
	);
}
function SelectPageNumber(
	pageNumber: number,
	setPageNumber: (arg0: number) => void,
	totalPages: number,
) {
	const [selectValue, setSelectValue] = useState(pageNumber.toString());

	useEffect(() => {
		setSelectValue(pageNumber.toString());
	}, [pageNumber]);

	return (
		<Select
			value={selectValue}
			onValueChange={(value: string) => {
				setPageNumber(Number(value));
				setSelectValue(value);
			}}
		>
			<SelectTrigger
				className="m-2 overflow-hidden max-w-sm p-2 hover:opacity-75 focus:outline-none ease-in-out transition-opacity duration-300 cursor-pointer w-auto"
				aria-label={`Changer de page. Page actuelle: ${pageNumber} page sur ${totalPages} pages`}
			>
				{`${pageNumber} / ${totalPages}`}
			</SelectTrigger>
			<SelectContent>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
					<SelectItem key={num} value={num.toString()}>
						{`${num} / ${totalPages}`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

interface PreviousPageButtonProps {
	previousPage: () => void;
}
function PreviousPageButton({ previousPage }: PreviousPageButtonProps) {
	return (
		<button
			type="button"
			className="absolute top-1/2 left-0 transform -translate-y-1/2 w-5/12 h-full opacity-0 hover:opacity-70 flex items-center justify-start ml-4"
			onClick={previousPage}
			style={{
				cursor:
					"url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjgwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LWJpZy1sZWZ0Ij48cGF0aCBkPSJNMTggMTVoLTZ2NGwtNy03IDctN3Y0aDZ2NnoiLz48L3N2Zz4='), auto",
			}}
		>
			<ChevronLeft className="w-40 h-40 md:hidden block" />
		</button>
	);
}

function NextPageButton({
	nextPage,
	disabled,
}: {
	nextPage: () => void;
	disabled: boolean;
}) {
	return (
		<button
			type="button"
			className="absolute top-1/2 right-0 transform -translate-y-1/2 w-5/12 h-full opacity-0 hover:opacity-70 flex items-center justify-end mr-4"
			onClick={nextPage}
			disabled={disabled}
			style={{
				cursor:
					"url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjgwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LWJpZy1yaWdodCI+PHBhdGggZD0iTTYgOWg2VjVsNyA3LTcgN3YtNEg2Vjl6Ii8+PC9zdmc+'), auto",
			}}
		>
			<ChevronRight className="w-40 h-40 md:hidden block" />
		</button>
	);
}
