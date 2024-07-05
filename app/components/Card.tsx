// MangaCard.tsx
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog-responsive";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import Info from "../detail/[slug]/info";
import type { ItemDetails } from "../types/getDetails";

export type CardProps = Pick<ItemDetails, "name" | "types" | "volumes">;

export default function Card({ name, types, volumes }: CardProps) {
	const firstVolumeType =
		volumes && volumes.length > 0 ? volumes[0].type : "Unknown";

	const imagePath = types.includes("anime")
		? `/api/image?path=${name}/anime/thumbnail.webp`
		: `/api/image?path=${name}/manga/${firstVolumeType}01/01-001.webp`;

	return (
		<div className="relative flex flex-col items-stretch rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform group hover:scale-105 transition duration-300 w-full">
			<Dialog>
				<DialogTrigger>
					<div className="relative flex flex-col items-stretch shine">
						<Image
							src={imagePath}
							alt={`${imagePath}`}
							quality={50}
							sizes="(min-width: 1540px) calc(20vw - 122px), (min-width: 1280px) calc(20vw - 96px), (min-width: 1040px) calc(25vw - 116px), (min-width: 780px) calc(33.33vw - 80px), calc(50vw - 16px)"
							placeholder="blur"
							width={200}
							height={800}
							className="object-cover w-full h-80 sm:h-76 md:h-72 lg:h-76 2xl:h-96"
							blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
						/>
						{types.includes("manga") && (
							<div
								className={`absolute ${
									types.includes("anime") ? "bottom-10" : "bottom-2"
								} left-2 bg-blue-900 text-sm px-2 py-1 rounded`}
							>
								Manga
							</div>
						)}
						{types.includes("anime") && (
							<div className="absolute bottom-2 left-2 bg-red-900 text-sm px-2 py-1 rounded">
								Anime
							</div>
						)}
					</div>
					<DialogTitle className="text-xs sm:text-sm md:text-base text-center transition-colors duration-300 group-hover:text-red-500 p-2">
						{name}
					</DialogTitle>
				</DialogTrigger>
				<DialogContent className=" h-full" aria-describedby={`${name} info`}>
					<Info
						params={{
							slug: encodeURI(name),
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
