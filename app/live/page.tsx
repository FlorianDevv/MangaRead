import { MobileNavbarComponent } from "@/components/navbar/mobilenavbar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GET as GET_CURRENT } from "../api/live/current/route";
import { GET as GET_SCHEDULE, type Schedule } from "../api/live/route";
import { getDetails } from "../types/getDetails";

interface Item {
	title: string;
	season: number;
	episode: number;
	start: number;
	realStartTime: number;
	startTime: string;
	duration: number;
	elapsedTime: number;
}

interface CurrentResponse {
	title: string;
	season: number;
	episode: number;
	start: number;
	realStartTime: number;
	startTime: string;
	duration: number;
	elapsedTime: number;
}

const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

export const metadata: Metadata = {
	title: data.metadata.schedule,
};

export const dynamic = "force-dynamic";

export default async function Page() {
	const responseCurrent = await GET_CURRENT();
	const current: CurrentResponse = await responseCurrent.json();

	async function CurrentItem() {
		let synopsis: string | undefined;
		let categories: string[] = [];
		if (current?.title) {
			const details = getDetails(current.title);
			if (details) {
				const resolvedDetails = await details;
				if (Array.isArray(resolvedDetails)) {
					synopsis = resolvedDetails[0].synopsis;
					categories = resolvedDetails[0].categories ?? [];
				} else {
					synopsis = resolvedDetails.synopsis;
					categories = resolvedDetails.categories ?? [];
				}
			}
		}
		return (
			<div className="flex flex-row items-center justify-center space-x-2">
				<Link href="/live/video">
					<Card className="flex flex-col items-center justify-center rounded  hover:scale-105 transform transition-transform duration-300 ease-in-out">
						<CardHeader className="text-center">
							<div className="relative mt-2">
								<Image
									src={`/api/image?path=${current.title}/anime/thumbnail.webp`}
									width={200}
									height={200}
									alt={current.title}
									quality={75}
								/>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 bg-red-600 rounded-lg mb-2 animate-pulse whitespace-nowrap">
									{data.live.title}
								</div>
							</div>
							<CardTitle className="font-bold text-lg mb-2">
								{current.title}
							</CardTitle>
							<CardDescription className="flex flex-col items-center justify-center">
								<span>
									{data.seasonSelect.season} {current.season}
								</span>
								<span>
									{data.episodeSelect.episode} {current.episode}
								</span>
							</CardDescription>
						</CardHeader>
						<CardContent className="text-center">
							<span className="flex flex-row space-x-2">
								<CalendarClock />
								{new Date(current.realStartTime)
									.toLocaleTimeString(language, {
										hour: "2-digit",
										minute: "2-digit",
									})
									.replace(":", "h")}{" "}
								-{" "}
								{new Date(current.realStartTime + current.duration * 1000)
									.toLocaleTimeString(language, {
										hour: "2-digit",
										minute: "2-digit",
									})
									.replace(":", "h")}
							</span>
							<Progress
								value={(current.elapsedTime / current.duration) * 100}
								max={100}
							/>
						</CardContent>
					</Card>
				</Link>
				<div className="flex flex-col  justify-center">
					{synopsis && (
						<div className="max-w-lg mb-4 ml-2">
							<p className="">{synopsis}</p>
						</div>
					)}
					{categories.length > 0 && (
						<div>
							<div className="flex flex-wrap justify-center md:justify-start mb-4">
								{categories.map((category) => (
									<span
										key={category}
										className="bg-accent  text-xs sm:text-sm rounded-full px-2 py-1 m-1"
									>
										{category}
									</span>
								))}
							</div>
						</div>
					)}
					<div className="flex space-x-2 flex-row">
						<Link href="/detail/[slug]" as={`/detail/${current.title}`}>
							<Button variant="secondary">VOD</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	async function ScheduleItems() {
		const responseSchedule = await GET_SCHEDULE();
		const schedule: Schedule[] = await responseSchedule.json();

		// Sort schedule by realStartTime
		const sortedSchedule = schedule.sort(
			(a, b) => a.realStartTime - b.realStartTime,
		);

		// Find the index of current in the sorted schedule
		const currentIndex = sortedSchedule.findIndex(
			(item) => item.realStartTime === current.realStartTime,
		);

		// Get the schedule from the next item onwards
		const upcomingSchedule =
			currentIndex >= 0
				? sortedSchedule.slice(currentIndex + 1)
				: sortedSchedule;

		interface GroupedItems {
			[key: string]: typeof upcomingSchedule;
		}

		const groupedItems = upcomingSchedule.reduce<GroupedItems>(
			(groups, item) => {
				const date = new Date(item.realStartTime);
				const dateKey = date.toISOString().split("T")[0];
				if (!groups[dateKey]) {
					groups[dateKey] = [];
				}
				groups[dateKey].push(item);
				return groups;
			},
			{},
		);
		const typedGroupedItems = groupedItems as Record<string, Item[]>;

		const formatDate = (dateString: string) => {
			const date = new Date(dateString);
			return date.toLocaleDateString(language, {
				weekday: "long",
				day: "numeric",
				month: "long",
			});
		};

		return (
			<div className="overflow-x-auto max-w-full md:mx-8 mx-2">
				<h2 className="font-bold text-lg mb-2 uppercase">
					{data.live.schedule}
				</h2>
				<div className="grid grid-flow-col gap-4 ">
					{Object.entries(typedGroupedItems).map(
						([date, items]: [string, Item[]]) => (
							<ul
								key={date}
								className="flex flex-col space-y-4 rounded p-2  border border-gray-500 "
							>
								<h3 className="text-sm 2xl:text-lg font-bold text-center">
									{formatDate(date)}
								</h3>
								{items.map((item: Item) => (
									<Link href={`/detail/${item.title}`} key={item.title}>
										<Card className="flex flex-col rounded border border-gray-900 hover:scale-105 transform transition-transform duration-300 ease-in-out">
											<CardHeader>
												<CardTitle className="font-bold text-lg mb-2 relative h-80 w-44">
													<Image
														src={`/api/image?path=${item.title}/anime/thumbnail.webp`}
														fill
														className="object-cover"
														alt={item.title}
														quality={75}
													/>
													<p className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black bg-opacity-50  text-center text-sm">
														{item.title}
													</p>
												</CardTitle>
												<CardDescription className="flex flex-col items-center justify-center">
													<span>
														{data.seasonSelect.season} {item.season}
													</span>
													<span>
														{data.episodeSelect.episode} {item.episode}
													</span>
												</CardDescription>
												<CardContent className="flex flex-row space-x-2">
													<CalendarDays />
													{new Date(item.realStartTime)
														.toLocaleTimeString(language, {
															hour: "2-digit",
															minute: "2-digit",
														})
														.replace(":", "h")}
													-
													{new Date(item.realStartTime + item.duration * 1000)
														.toLocaleTimeString(language, {
															hour: "2-digit",
															minute: "2-digit",
														})
														.replace(":", "h")}
												</CardContent>
											</CardHeader>
										</Card>
									</Link>
								))}
							</ul>
						),
					)}
				</div>
			</div>
		);
	}

	return (
		<MobileNavbarComponent>
			<div className="flex flex-col items-center justify-center mt-8">
				<CurrentItem />
				<ScheduleItems />
			</div>
		</MobileNavbarComponent>
	);
}
