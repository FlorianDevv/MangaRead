import type { ItemDetails } from "@/app/types/getDetails";
import { Button } from "@/components/ui/button";
import { BookOpen, InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MangaDetailComponent({
	detail,
	data,
	isPriority,
}: {
	detail: ItemDetails;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
	isPriority: boolean;
}) {
	const imageSrc = `/api/image?path=${detail.name}/manga/01/01-001.webp`;

	return (
		<div className="relative flex-shrink-0 w-full h-126 flex flex-col items-center">
			<Image
				src={imageSrc}
				alt="cover image back"
				className="object-cover opacity-25 blur-lg"
				fill
				quality={1}
				placeholder="blur"
				blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
				priority={isPriority}
			/>
			<div className="relative w-full flex justify-center mt-8">
				<div className="relative w-56 h-80">
					<Image
						src={imageSrc}
						alt=""
						className="object-scale-down md:transform  md:transition-transform md:duration-500 md:rotate-12 md:hover:rotate-0 md:hover:scale-110"
						quality={75}
						width={300}
						height={400}
						placeholder="blur"
						blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
						priority={isPriority}
					/>
				</div>
			</div>

			<div className="relative w-full h-full flex items-end mb-4">
				<div className="relative w-32 m-2 h-48">
					<Image
						src={imageSrc}
						alt="cover image front"
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
					<h1 className="text-xl">{detail.name}</h1>
					<p className="text-xs pr-2 line-clamp-2 lg:line-clamp-3 max-w-lg">
						{detail.synopsis}
					</p>
					<p className="text-sm font-normal">
						{detail.volumes?.length ?? 0}{" "}
						{`${(detail.volumes?.[0]?.type ?? data.carousel.volumes).trim()}s`}
					</p>
					<div>
						<Link href={`/manga/${detail.name}/1`}>
							<Button>
								<BookOpen className="mr-2" />
								<span className="sm:hidden">{data.carousel.read}</span>
								<span className="hidden sm:block">{data.carousel.start}</span>
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
					</div>
				</div>
			</div>
		</div>
	);
}
