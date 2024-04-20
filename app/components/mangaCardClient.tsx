"use client";
import Image from "next/image";
import Link from "next/link";
export default function MangaCardClient({ mangaName }: { mangaName: string }) {
  return (
    <div className="group flex flex-col items-stretch  bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform  transition-transform duration-300">
      <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 shine">
        <Link href={`/manga/${mangaName}`}>
          <Image
            src={`/${mangaName}/manga/Tome 01/01-001.webp`}
            alt={mangaName}
            style={{ objectFit: "cover" }}
            quality={1}
            fill
            sizes="70vw"
            className="transition-all duration-500 ease-in-out transform "
          />
        </Link>
      </div>
      <div className="p-2">
        <h4 className="text-sm text-center text-white transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
          {decodeURIComponent(mangaName)}
        </h4>
      </div>
    </div>
  );
}
