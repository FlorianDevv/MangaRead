"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
	GalleryHorizontal,
	GalleryVertical,
	Settings,
	Star,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function getSettings() {
	if (typeof window === "undefined") {
		return { qualityNumber: 75, read: "horizontal" };
	}

	const settings = JSON.parse(localStorage.getItem("settings") || "[]");
	const qualityObj = settings.find(
		(setting: { quality: number }) => setting.quality,
	);
	const readObj = settings.find((setting: { read: string }) => setting.read);

	const qualityNumber = qualityObj
		? qualityObj.quality
		: Number.parseInt(process.env.DEFAULT_QUALITY || "75", 10);
	const read = readObj ? readObj.read : "horizontal";

	return { qualityNumber, read };
}

export function updateSettings(newSettings: string) {
	if (typeof window === "undefined") {
		return newSettings;
	}

	localStorage.setItem("settings", JSON.stringify(newSettings));
	window.dispatchEvent(new Event("settingsUpdated"));
}

function qualityColor(quality: number) {
	if (quality === 100) return "text-green-500";
	if (quality >= 75) return "text-green-400";
	if (quality >= 50) return "text-yellow-500";
	if (quality >= 25) return "text-orange-500";
	return "text-red-500";
}

function qualityIndicator(quality: number) {
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);

	let qualityMessage: string;
	if (quality === 100) qualityMessage = data.settings.qualityIndicator.lossless;
	else if (quality >= 75)
		qualityMessage = data.settings.qualityIndicator.excellent;
	else if (quality >= 50) qualityMessage = data.settings.qualityIndicator.good;
	else if (quality >= 25)
		qualityMessage = data.settings.qualityIndicator.average;
	else qualityMessage = data.settings.qualityIndicator.low;

	return qualityMessage;
}

export function Quality({
	qualityNumber: initialQualityNumber,
	setQuality: externalSetQuality,
}: {
	qualityNumber?: number;
	setQuality?: (value: number) => void;
}) {
	const getInitialQuality = () => {
		if (typeof window !== "undefined") {
			const settings = JSON.parse(localStorage.getItem("settings") || "[]");
			const qualitySetting = settings.find(
				(setting: object) => "quality" in setting,
			);
			return qualitySetting
				? qualitySetting.quality
				: Number.parseInt(process.env.DEFAULT_QUALITY || "75", 10);
		}
		return 75;
	};

	const [tempQualityNumber, setTempQualityNumber] = useState<number>(
		initialQualityNumber || getInitialQuality(),
	);

	const [qualityNumber, setQualityNumber] = useState<number>(
		getInitialQuality(),
	);

	const setQualityFinal = useCallback(
		(value: number) => {
			setQualityNumber(value);
			if (externalSetQuality) {
				externalSetQuality(value);
			}
			if (typeof window !== "undefined") {
				const settings = JSON.parse(localStorage.getItem("settings") || "[]");
				const qualityExists = settings.some(
					(setting: object) => "quality" in setting,
				);
				let newSettings: object;
				if (!qualityExists) {
					newSettings = [...settings, { quality: value }];
				} else {
					newSettings = settings.map((setting: object) =>
						"quality" in setting ? { quality: value } : setting,
					);
				}
				localStorage.setItem("settings", JSON.stringify(newSettings));
			}
		},
		[externalSetQuality],
	);

	useEffect(() => {
		if (initialQualityNumber) {
			setQualityFinal(initialQualityNumber);
		}
	}, [initialQualityNumber, setQualityFinal]);

	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);
	const maxQuality: number = Number.parseInt(
		process.env.MAX_QUALITY || "100",
		10,
	);
	const minQuality: number = Number.parseInt(
		process.env.MIN_QUALITY || "0",
		10,
	);

	return (
		<div className="flex items-center flex-col ">
			<label
				htmlFor="quality"
				className="flex justify-center items-center my-1"
			>
				{data.settings.quality.title}
				<div className="ml-1">
					<Star />
				</div>
			</label>
			<Slider
				id="quality"
				name="quality"
				min={minQuality}
				max={maxQuality}
				step={1}
				value={[tempQualityNumber]}
				onValueChange={(value: number[]) => setTempQualityNumber(value[0])}
				onValueCommit={(value: number[]) => setQualityFinal(value[0])}
				className="w-40 my-1"
				aria-label={`Qualité: ${tempQualityNumber}`}
			/>
			<p className={`${qualityColor(tempQualityNumber)}`}>
				{tempQualityNumber} - {qualityIndicator(tempQualityNumber)}
			</p>
		</div>
	);
}
// Read Component
export function Read({
	isVertical: initialIsVertical,
	setIsVertical: externalSetIsVertical,
}: {
	isVertical?: boolean;
	setIsVertical?: (value: boolean) => void;
}) {
	const getInitialReadMode = () => {
		if (typeof window !== "undefined") {
			const settings = JSON.parse(localStorage.getItem("settings") || "[]");
			const readSetting = settings.find(
				(setting: string[]) => "read" in setting,
			);
			return readSetting ? readSetting.read === "vertical" : true;
		}
		return true;
	};

	const [isVertical, setIsVertical] = useState<boolean>(getInitialReadMode);

	const setReadMode = useCallback(
		(value: boolean) => {
			setIsVertical(value);
			if (externalSetIsVertical) {
				externalSetIsVertical(value);
			}
			if (typeof window !== "undefined") {
				const settings = JSON.parse(localStorage.getItem("settings") || "[]");
				const readExists = settings.some(
					(setting: string[]) => "read" in setting,
				);
				let newSettings: string[];
				if (!readExists) {
					newSettings = [
						...settings,
						{ read: value ? "vertical" : "horizontal" },
					];
				} else {
					newSettings = settings.map((setting: { read: string }) =>
						"read" in setting
							? { read: value ? "vertical" : "horizontal" }
							: setting,
					);
				}
				localStorage.setItem("settings", JSON.stringify(newSettings));
			}
		},
		[externalSetIsVertical],
	);

	useEffect(() => {
		if (initialIsVertical !== undefined) {
			setReadMode(initialIsVertical);
		}
	}, [initialIsVertical, setReadMode]);
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);

	return (
		<div className="flex items-center flex-col ">
			<label htmlFor="read" className="flex items-center justify-center my-1">
				{data.settings.read.reading}{" "}
				<div className="ml-1">
					{isVertical ? <GalleryVertical /> : <GalleryHorizontal />}
				</div>
			</label>
			<Select
				name="read"
				value={isVertical ? "vertical" : "horizontal"}
				onValueChange={(value: string) => setReadMode(value === "vertical")}
			>
				<SelectTrigger
					className="p-2 mx-2 text-xs hover:shadow-lg hover:opacity-75 transition-opacity ease-in-out duration-300 focus:outline-none cursor-pointer w-auto"
					aria-label={
						isVertical
							? data.settings.read.changeToHorizontal
							: data.settings.read.changeToVertical
					}
				>
					{isVertical
						? data.settings.read.vertical
						: data.settings.read.horizontal}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="vertical">
						{data.settings.read.verticalReading}
					</SelectItem>
					<SelectItem value="horizontal">
						{data.settings.read.horizontalReading}
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

interface SettingsInterface {
	qualityNumber: number;
	setQuality: (value: number) => void;
	setIsVertical: (value: boolean) => void;
	isVertical: boolean;
}

interface SettingsDialogProps {
	classNames?: string[];
	isOpen?: boolean;
	settings?: SettingsInterface;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
	classNames,
	isOpen,
	settings,
}) => {
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);
	return (
		<div
			className={`${classNames?.join(" ")} ${
				isOpen ? "" : "opacity-0 pointer-events-none"
			}`}
		>
			<Dialog>
				<DialogTrigger asChild>
					<Button title={data.settings.dialog.button}>
						<Settings />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							<div className="flex items-center justify-center">
								{data.settings.dialog.settings}
								<div className="ml-2">
									<Settings />
								</div>
							</div>
						</DialogTitle>
						<DialogDescription>{data.settings.dialog.modify}</DialogDescription>
					</DialogHeader>
					<Quality
						qualityNumber={settings?.qualityNumber}
						setQuality={settings?.setQuality}
					/>
					<Read
						isVertical={settings?.isVertical}
						setIsVertical={settings?.setIsVertical}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};
