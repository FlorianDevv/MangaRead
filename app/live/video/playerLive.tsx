"use client";
import styles from "@/app/playerlive.module.css";
import {
	type MediaPlayEvent,
	MediaPlayer,
	MediaProvider,
	type MediaProviderAdapter,
	Poster,
	isHTMLVideoElement,
	isVideoProvider,
	useMediaRemote,
} from "@vidstack/react";
import {
	DefaultAudioLayout,
	DefaultVideoLayout,
	defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import React, { useCallback, useEffect, useState, useRef } from "react";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import Image from "next/image";

interface VideoData {
	title: string;
	season: number;
	episode: number;
	elapsedTime: number;
}

export default function PlayerLive() {
	const [videoData, setVideoData] = useState<VideoData | null>(null);
	const [src, setSrc] = useState("");
	const [thumbnailSrc, setThumbnailSrc] = useState("");
	const remote = useMediaRemote();
	const fetchVideoData = useCallback(async () => {
		try {
			const response = await fetch("/api/live/current");
			const data = await response.json();

			if (data.error) {
				console.error("Error fetching video data:", data.error);
				return;
			}

			setVideoData(data);
			const season = data.season.toString().padStart(2, "0");
			const episode = data.episode.toString().padStart(3, "0");
			setSrc(
				`/api/video?videoId=${data.title}/anime/Season${season}/${season}-${episode}.mp4`,
			);
			setThumbnailSrc(
				`/api/image?type=thumbnail&path=${data.title}/anime/Season${season}/${season}-${episode}.webp`,
			);
		} catch (error) {
			console.error("Error fetching video data:", error);
		}
	}, []);

	useEffect(() => {
		fetchVideoData();
	}, [fetchVideoData]);

	const onProviderSetup = useCallback(
		(provider: MediaProviderAdapter): void => {
			if (isVideoProvider(provider) && isHTMLVideoElement(provider.video)) {
				const player = provider.video;
				player.onloadedmetadata = () => {
					if (videoData) {
						player.currentTime = videoData.elapsedTime;
					}
				};
			}
		},
		[videoData],
	);

	const handlePlay = useCallback(
		(triggerEvent: MediaPlayEvent) => {
			if (remote) {
				remote.enterFullscreen("prefer-media", triggerEvent);
			}
		},
		[remote],
	);

	const handleVideoEnd = useCallback(() => {
		fetchVideoData();
	}, [fetchVideoData]);

	if (!videoData) {
		return null;
	}

	return (
		<MediaPlayer
			key={src}
			src={{ src, type: "video/mp4" }}
			onProviderSetup={onProviderSetup}
			onEnded={handleVideoEnd}
			autoPlay
			onPlay={handlePlay}
			keyDisabled
			controls={false}
			title={`${videoData.title} - S${videoData.season} E${videoData.episode}`}
			className={`${styles.player} ${styles["vds-video-layout"]} max-w-full max-h-full object-contain`}
		>
			<MediaProvider>
				<Poster asChild className="vds-poster">
					<Image src={thumbnailSrc} alt="Thumbnail" />
				</Poster>
			</MediaProvider>
			<DefaultVideoLayout
				disableTimeSlider={true}
				noKeyboardAnimations={true}
				noGestures={true}
				noScrubGesture={true}
				icons={defaultLayoutIcons}
				className={`${styles.player} ${styles["vds-video-layout"]}`}
			/>
			<DefaultAudioLayout icons={defaultLayoutIcons} />
		</MediaPlayer>
	);
}
