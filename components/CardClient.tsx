"use client";
import Image from "next/image";
import Link from "next/link";
import type { ItemDetails } from "../app/types/getDetails";

export type CardProps = Pick<ItemDetails, "name" | "types" | "volumes"> & {
	categories?: string[];
};

export default function CardClient({
	name,
	types,
	volumes,
	categories,
}: CardProps) {
	const firstVolumeType =
		volumes && volumes.length > 0 ? volumes[0].type : "Tome";

	const imagePath = types.includes("anime")
		? `/api/image?path=${name}/anime/thumbnail.webp`
		: `/api/image?path=${name}/manga/${firstVolumeType}01/01-001.webp`;

	return (
		<div className="relative flex flex-col items-stretch rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform group hover:scale-105 transition-transform duration-300 w-full">
			<Link href={`/detail/${name}`}>
				<div className="relative flex flex-col items-stretch shine">
					<Image
						src={imagePath}
						alt={name}
						quality={75}
						width={250}
						height={300}
						className="object-cover w-full h-80 sm:h-76 md:h-72 lg:h-76 2xl:h-96"
						placeholder="blur"
						blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
					/>
					{types.includes("manga") && (
						<div
							className={`absolute text-white ${
								types.includes("anime") ? "bottom-10" : "bottom-2"
							} left-2 bg-blue-900 text-sm px-2 py-1 rounded`}
						>
							Manga
						</div>
					)}
					{types.includes("anime") && (
						<div className="text-white absolute bottom-2 left-2 bg-red-900 text-sm px-2 py-1 rounded">
							Anime
						</div>
					)}
				</div>
				<div className="p-2">
					<h4 className="text-sm text-center  transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
						{decodeURIComponent(name)}
					</h4>
					{categories && (
						<p className="text-xs text-center text-foreground/80 transition-colors duration-300 ease-in-out group-hover:text-red-800 break-words">
							{categories.join(", ")}
						</p>
					)}
				</div>
			</Link>
		</div>
	);
}
