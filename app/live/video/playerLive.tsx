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

interface VideoData {
	title: string;
	season: number;
	episode: number;
	elapsedTime: number;
}

export default function PlayerLive() {
	const [videoData, setVideoData] = useState<VideoData | null>(null);
	const playerRef = useRef<HTMLVideoElement | null>(null);
	const [metadataLoaded, setMetadataLoaded] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

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
			setMetadataLoaded(false);
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
				playerRef.current = provider.video;
				playerRef.current.onloadedmetadata = () => {
					setMetadataLoaded(true);
				};
			}
		},
		[],
	);

	useEffect(() => {
		if (videoData && metadataLoaded && playerRef.current) {
			playerRef.current.currentTime = videoData.elapsedTime;
		}
	}, [videoData, metadataLoaded]);

	const handlePlay = useCallback(
		async (event: MediaPlayEvent) => {
			// Fetch the latest video data when play is triggered
			await fetchVideoData();

			if (playerRef.current && videoData) {
				playerRef.current.currentTime = videoData.elapsedTime;
			}

			if (remote && !isFullscreen) {
				setTimeout(() => {
					remote.enterFullscreen("prefer-media", event);
					setIsFullscreen(true);
				}, 2000);
			}
		},
		[remote, isFullscreen, fetchVideoData, videoData],
	);

	const handleVideoEnd = useCallback(() => {
		setIsFullscreen(document.fullscreenElement !== null);
		fetchVideoData();
	}, [fetchVideoData]);

	const handleFullscreenChange = useCallback(() => {
		setIsFullscreen(document.fullscreenElement !== null);
	}, []);

	useEffect(() => {
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, [handleFullscreenChange]);

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
			playsInline
			onPlay={handlePlay}
			keyDisabled
			controls={false}
			title={`${videoData.title} - S${videoData.season} E${videoData.episode}`}
			className={`${styles.player} ${styles["vds-video-layout"]} max-w-full max-h-full object-contain`}
		>
			<MediaProvider>
				<Poster className="vds-poster" src={thumbnailSrc} />
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
