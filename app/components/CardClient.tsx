"use client";
import Image from "next/image";
import Link from "next/link";
import { ItemDetails } from "../types/getDetails";

export type CardProps = Pick<ItemDetails, "name" | "types"> & {
  categories?: string[];
};

export default function CardClient({ name, types, categories }: CardProps) {
  const imagePath = types.includes("anime")
    ? `/${name}/anime/thumbnail.webp`
    : `/${name}/manga/Tome 01/01-001.webp`;

  return (
    <div className="relative flex flex-col items-stretch rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform group hover:scale-105 transition-transform duration-300 w-full">
      <Link href={`/detail/${name}`}>
        <div className="relative flex flex-col items-stretch shine">
          <Image
            src={imagePath}
            alt={name}
            quality={50}
            width={200}
            height={800}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover w-full h-80 sm:h-76 md:h-72 lg:h-76 2xl:h-96"
            placeholder="blur"
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
        <div className="p-2">
          <h4 className="text-sm text-center transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
            {decodeURIComponent(name)}
          </h4>
          {categories && (
            <p className="text-xs text-center  transition-colors duration-300 ease-in-out group-hover:text-red-800 break-words text-gray-400">
              {categories.join(", ")}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
