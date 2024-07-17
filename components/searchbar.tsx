"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
export interface SearchBarProps {
	details: { name: string; imagePath: string }[];
}

export default function SearchBar({ details }: SearchBarProps) {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState<{ name: string; imagePath: string }[]>(
		[],
	);
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);

	useEffect(() => {
		if (search !== "" && Array.isArray(details)) {
			const searchResults = details
				.filter((manga) =>
					manga.name.toLowerCase().includes(search.toLowerCase()),
				)
				.slice(0, 4);

			setResults(searchResults);
		} else {
			setResults([]);
		}
	}, [search, details]);

	const resetSearch = () => {
		setSearch("");
		setResults([]);
	};

	return (
		<div className="relative">
			<div className="flex items-center justify-center flex-col lg:mr-8 ">
				<Input
					name={data.search.title}
					placeholder={data.search.title}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="font-normal"
				/>
			</div>
			<div
				className={
					"absolute w-full mt-2 z-10 dark:bg-black bg-white bg-opacity-90 h-auto z-99 rounded shadow-lg shadow-black border-1 border-white border-opacity-50"
				}
			>
				{search !== "" &&
					results.map((result) => (
						<div key={result.name}>
							<Link href={`/detail/${result.name}`}>
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<div
									className="group flex items-center rounded border-t-2 pt-1 pl-1 w-full hover:bg-accent hover:text-accent-foreground transition-colors"
									onClick={resetSearch}
								>
									<Image
										src={result.imagePath}
										alt={result.name}
										width={60}
										height={60}
										quality={75}
										placeholder="blur"
										blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
									/>
									<p className="ml-2 group-hover:text-foreground/100 text-foreground/60 transition-colors duration-200">
										{result.name}
									</p>
								</div>
							</Link>
						</div>
					))}
			</div>
		</div>
	);
}
