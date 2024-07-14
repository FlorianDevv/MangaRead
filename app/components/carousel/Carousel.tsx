"use client";
import type { ItemDetails } from "@/app/types/getDetails";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import AnimeDetailComponent from "./anime/animeDetailComponent";
import MangaDetailComponent from "./manga/mangaDetailComponent";

interface EmblaCarouselProps {
	Details: ItemDetails[];
}
const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

// MuteContext
const MuteContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const MuteProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isMuted, setIsMuted] = useState(true);

	return (
		<MuteContext.Provider value={[isMuted, setIsMuted]}>
			{children}
		</MuteContext.Provider>
	);
};

export const useMute = () => {
	const context = useContext(MuteContext);
	if (context === undefined) {
		throw new Error("useMute must be used within a MuteProvider");
	}
	return context;
};

function DetailComponent({
	detail,
	isActive,
	emblaApi,
	isPriority,
}: {
	detail: ItemDetails;
	isActive: boolean;
	emblaApi: EmblaCarouselType | null;
	isPriority: boolean;
}) {
	if (detail.types.includes("anime")) {
		return (
			<AnimeDetailComponent
				detail={detail}
				isActive={isActive}
				emblaApi={emblaApi}
				data={data}
				isPriority={isPriority}
			/>
		);
	}
	if (detail.types.includes("manga")) {
		return (
			<MangaDetailComponent
				detail={detail}
				data={data}
				isPriority={isPriority}
			/>
		);
	}
	return null;
}
export default function EmblaCarousel(props: EmblaCarouselProps) {
	const { Details } = props;
	const [activeIndex, setActiveIndex] = useState(0);
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

	useEffect(() => {
		if (!emblaApi) return;

		emblaApi.on("select", () => {
			const activeIndex = emblaApi.selectedScrollSnap();
			setActiveIndex(activeIndex);
		});
	}, [emblaApi]);

	const scrollPrev = () => {
		if (emblaApi) {
			emblaApi.scrollPrev();
		}
	};

	const scrollNext = () => {
		if (emblaApi) {
			emblaApi.scrollNext();
		}
	};

	return (
		<MuteProvider>
			<div className="relative overflow-hidden" ref={emblaRef}>
				<div className="flex">
					{Details.map((Detail, index) => {
						const isActive = index === activeIndex;
						const isPriority = index === 0;
						return (
							<DetailComponent
								detail={Detail}
								isActive={isActive}
								key={Detail.name}
								emblaApi={emblaApi || null}
								isPriority={isPriority}
							/>
						);
					})}
				</div>
				<button
					type="button"
					className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 dark:bg-black bg-white bg-opacity-50 rounded-full shadow-lg"
					onClick={scrollPrev}
					aria-label="Previous Slide"
				>
					<ChevronLeft className="w-10 h-10" />
				</button>
				<button
					type="button"
					className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 dark:bg-black bg-white bg-opacity-50 rounded-full shadow-lg"
					onClick={scrollNext}
					aria-label="Next Slide"
				>
					<ChevronRight className="w-10 h-10" />
				</button>
				<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
					{Details.map((_, index) => (
						<div
							key={_.name}
							className={`w-2 h-2 rounded-full flex items-center justify-center m-0 p-0 border  appearance-none tap-highlight-transparent 
${index === activeIndex ? "dark:bg-white dark:border-black bg-black border-white" : "dark:bg-black bg-white dark:border-white border-black"}`}
						>
							<div
								className={`w-7 h-7 rounded-full flex items-center justify-center box-border 
  ${index === activeIndex ? "text-body" : "stext-detail-medium-contrast"}`}
							/>
						</div>
					))}
				</div>
			</div>
		</MuteProvider>
	);
}
