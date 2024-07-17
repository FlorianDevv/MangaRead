"use client";

import type { ItemDetails } from "@/app/types/getDetails";
import { Button } from "@/components/ui/button";
import type { EmblaCarouselType } from "embla-carousel";
import { InfoIcon, PlayIcon, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMute } from "../Carousel";

export default function AnimeDetailComponent({
	detail,
	isActive,
	emblaApi,
	data,
	isPriority,
}: {
	detail: ItemDetails;
	isActive: boolean;
	emblaApi: EmblaCarouselType | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
	isPriority: boolean;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isMuted, setIsMuted] = useMute();

	useEffect(() => {
		if (isActive && videoRef.current) {
			videoRef.current.play();
		} else if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = 0;
		}
	}, [isActive]);

	const handleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !videoRef.current.muted;
			setIsMuted(!isMuted);
		}
	};

	const videoSrc = useMemo(
		() => `/api/video?type=preview&videoId=${detail.name}`,
		[detail.name],
	);
	const thumbnailSrc = useMemo(
		() => `/api/image?path=${detail.name}/anime/thumbnail.webp`,
		[detail.name],
	);

	const posterSrc = useMemo(
		() =>
			`/api/image?type=thumbnail&path=${detail.name}/anime/Season01/01-001.webp`,
		[detail.name],
	);

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (videoRef.current) {
				const progress =
					(videoRef.current.currentTime / videoRef.current.duration) * 100;
				setProgress(progress);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const [isIntersecting, setIsIntersecting] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
				if (entry.isIntersecting && videoRef.current && isActive) {
					videoRef.current.play();
				}
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.1,
			},
		);

		if (ref.current) {
			const currentRef = ref.current;
			observer.observe(currentRef);

			return () => {
				observer.unobserve(currentRef);
			};
		}
	}, [isActive]);

	return (
		<div
			className="relative flex-shrink-0 w-full h-126"
			key={detail.name}
			ref={ref}
		>
			{isIntersecting && (
				<>
					<video
						poster={posterSrc}
						ref={videoRef}
						src={videoSrc}
						muted={isMuted}
						className="absolute w-full h-full object-cover"
						onEnded={() => emblaApi?.scrollNext()}
						autoPlay
						playsInline
						preload="none"
					/>

					<div className="relative w-full h-full flex items-end">
						<div className="relative w-32 m-2 h-48">
							<Image
								src={thumbnailSrc}
								alt={"cover image front"}
								className="object-contain"
								quality={75}
								width={150}
								height={200}
								placeholder="blur"
								blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
								priority={isPriority}
							/>
						</div>
						<div className="w-1/2 text-left ml-4 space-y-2 flex flex-col justify-center">
							<h1 className="text-xl text-white">{detail.name}</h1>
							<p className="text-xs pr-2 line-clamp-2 lg:line-clamp-3 max-w-lg text-white">
								{detail.synopsis}
							</p>
							<p className="text-sm font-normal text-white">
								{detail.seasons?.length ?? 0} {data.carousel.seasons},{" "}
								{detail.episodeNumber} {data.carousel.episodes}
							</p>
							<div>
								<Link href={`/anime/${detail.name}/season01/episode01`}>
									<Button>
										<PlayIcon className="mr-2" />
										<span className="sm:hidden">{data.carousel.watch}</span>
										<span className="hidden sm:block">
											{data.carousel.startW}
										</span>
									</Button>
								</Link>

								<Link href={`/detail/${detail.name}`}>
									<Button
										variant="ghost"
										className="rounded-full p-2 m-4 bg-opacity-50 dark:bg-black bg-white"
										aria-label="More Info"
									>
										<InfoIcon />
									</Button>
								</Link>
								<Button
									variant="ghost"
									onClick={handleMute}
									className="absolute right-1 bottom-8 md:bottom-1/4 transform translate-y-1/2 m-4 dark:bg-black bg-white bg-opacity-50 rounded-full p-1"
									aria-label="Mute/Unmute Video"
								>
									{isMuted ? (
										<VolumeX className="w-10 h-10" />
									) : (
										<Volume2 className="w-10 h-10" />
									)}
								</Button>
							</div>
						</div>
					</div>
					<div className="h-1 dark:bg-black bg-white w-full bottom-0 absolute">
						<div
							style={{ width: `${progress}%` }}
							className="absolute h-1 bg-red-600"
						/>
					</div>
				</>
			)}
		</div>
	);
}
