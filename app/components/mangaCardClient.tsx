"use client";
import Image from "next/image";
import Link from "next/link";

interface MangaCardClientProps {
  mangaName: string;
  categories?: string[];
  type?: "manga" | "anime" | "both";
}

export default function MangaCardClient({
  mangaName,
  categories,
  type,
}: MangaCardClientProps) {
  const imagePath =
    type === "anime"
      ? `/${mangaName}/anime/Season01/01-001.webp`
      : `/${mangaName}/manga/Tome 01/01-001.webp`;

  return (
    <div className="relative flex flex-col items-stretch rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform group hover:scale-105 transition-transform duration-300 w-full">
      <Link href={`/manga/${mangaName}`}>
        <div className="relative flex flex-col items-stretch shine">
          <Image
            src={imagePath}
            alt={mangaName}
            quality={10}
            width={200}
            height={800}
            sizes="70vw"
            className="object-cover w-full h-80 sm:h-76 md:h-72 lg:h-76 2xl:h-96"
          />
          {type === "manga" && (
            <div className="absolute bottom-2 left-2 bg-blue-900  text-xs px-2 py-1 rounded">
              Manga
            </div>
          )}
          {type === "anime" && (
            <div className="absolute bottom-2 left-2 bg-red-900  text-xs px-2 py-1 rounded">
              Anime
            </div>
          )}
          {type === "both" && (
            <>
              <div className="absolute bottom-2 left-2 bg-blue-900 text-xs px-2 py-1 rounded">
                Manga
              </div>
              <div className="absolute bottom-10 left-2 bg-red-900  text-xs px-2 py-1 rounded">
                Anime
              </div>
            </>
          )}
        </div>
        <div className="p-2">
          <h4 className="text-sm text-center transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
            {decodeURIComponent(mangaName)}
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
