import fs from "node:fs/promises";
import path from "node:path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export const dynamic = "force-dynamic";
const dbPath = "db/items.db";

async function openDb() {
	return open({
		filename: dbPath,
		driver: sqlite3.Database,
	});
}

type SeasonDetails = {
	season: string;
	episodes: number[];
};

type VolumeDetails = {
	name: string;
	totalPages: number;
	type: string;
	path: string;
};

export type ItemDetails = {
	animePath: string;
	mangaPath: string;
	name: string;
	synopsis?: string;
	volumes?: VolumeDetails[];
	types: ("manga" | "anime")[];
	seasons?: SeasonDetails[];
	episodeNumber?: number;
	categories?: string[];
};

type ItemRecord = {
	item_id: number;
	title: string;
	types_and_paths: string;
};

async function getItemFromDb(slug?: string): Promise<ItemRecord[]> {
	const db = await openDb();
	const query = slug
		? "SELECT item_id, title, types_and_paths FROM items WHERE title = ?"
		: "SELECT item_id, title, types_and_paths FROM items";
	const params = slug ? [slug] : [];

	return db.all(query, params);
}

async function processVolumes(mangaPath: string): Promise<VolumeDetails[]> {
	try {
		const volumes = await fs.readdir(mangaPath);
		return await Promise.all(
			volumes
				.filter(async (volume) => {
					const volumePath = path.join(mangaPath, volume);
					const stat = await fs.lstat(volumePath);
					return stat.isDirectory();
				})
				.map(async (volume) => {
					const volumePath = path.join(mangaPath, volume);
					const images = await fs.readdir(volumePath);
					const totalPages = images.length;
					const volumeNumber = Number.parseInt(
						volume.match(/\d+$/)?.[0] || "",
						10,
					).toString();
					const volumeNameWithoutNumbers = volume.replace(/\d+$/, "");
					return {
						name: volumeNumber,
						totalPages,
						type: volumeNameWithoutNumbers,
						path: volumePath,
					};
				}),
		);
	} catch (error) {
		console.error(`Error processing manga path ${mangaPath}:`, error);
		return [];
	}
}

async function processAnime(animePath: string): Promise<SeasonDetails[]> {
	try {
		const allDirectories = await fs.readdir(animePath);
		const seasons = allDirectories.filter((season) =>
			/^Season\d+$/i.test(season),
		);

		return await Promise.all(
			seasons.map(async (season) => {
				const seasonPath = path.join(animePath, season);
				try {
					const episodes = (await fs.readdir(seasonPath))
						.filter((episode) => path.extname(episode) === ".mp4")
						.map((episode) => {
							const match = episode.match(/(\d+)\.mp4$/);
							return match ? Number.parseInt(match[1], 10) : 0;
						});

					const seasonMatch = season.match(/Season(\d+)$/i);
					const seasonNumber = seasonMatch
						? Number.parseInt(seasonMatch[1], 10).toString()
						: season;
					return {
						season: seasonNumber,
						episodes,
					};
				} catch (error) {
					console.error(`Error processing season ${season}:`, error);
					return null;
				}
			}),
		).then((results) =>
			results.filter((detail): detail is SeasonDetails => detail !== null),
		);
	} catch (error) {
		console.error(`Error processing anime path ${animePath}:`, error);
		return [];
	}
}

export async function getDetails(
	decodedSlug?: string,
	options?: { mangaOnly: boolean },
): Promise<ItemDetails | ItemDetails[]> {
	const slug = decodedSlug ? decodeURIComponent(decodedSlug) : "";
	const items = await getItemFromDb(slug);

	const itemDetailsPromises = items.map(async (item) => {
		const { title, types_and_paths } = item;
		const pathsInfo = JSON.parse(types_and_paths);

		let animePath = "";
		let mangaPath = "";
		const types: ("manga" | "anime")[] = [];

		for (const pathInfo of pathsInfo) {
			if (pathInfo.type === "manga") {
				mangaPath = path.join(pathInfo.path, "manga");
				types.push("manga");
				if (options?.mangaOnly) break;
			} else if (!options?.mangaOnly && pathInfo.type === "anime") {
				animePath = path.join(pathInfo.path, "anime");
				types.push("anime");
			}
		}

		const volumes = mangaPath ? await processVolumes(mangaPath) : [];

		if (options?.mangaOnly) {
			return {
				title,
				types: types.filter((type) => type === "manga"),
				volumes,
				mangaPath,
				animePath: "",
				name: title,
			};
		}

		let synopsis: string | undefined;
		let categories: string[] = [];
		const resumePath = path.join(
			path.dirname(mangaPath || animePath),
			"resume.json",
		);
		try {
			const resumeData = await fs.readFile(resumePath, "utf-8");
			const data = JSON.parse(resumeData);
			synopsis = data.synopsis;
			categories = data.categories ?? [];
		} catch (error) {
			console.error("Error reading resume.json:", error);
		}

		const seasonDetails = animePath ? await processAnime(animePath) : [];

		return {
			name: title,
			synopsis,
			types,
			seasons: seasonDetails,
			categories,
			volumes,
			episodeNumber: seasonDetails.reduce(
				(total, season) => total + season.episodes.length,
				0,
			),
			mangaPath,
			animePath,
		};
	});

	const itemDetails = await Promise.all(itemDetailsPromises);

	return slug ? itemDetails[0] : itemDetails;
}
