"use client";
import Image from "next/image";
export default function MangaCardClient({ mangaName }: { mangaName: string }) {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform group hover:scale-105 transition-transform duration-300">
      <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 shine">
        <Image
          src={`/${mangaName}/Tome 01/01-001.webp`}
          alt={mangaName}
          style={{ objectFit: "cover" }}
          quality={1}
          fill
          sizes="90vw"
          className="transition-all duration-500 ease-in-out transform "
        />
      </div>
      <div className="p-2">
        <h4 className="text-sm text-center text-white transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
          {mangaName}
        </h4>
      </div>
    </div>
  );
}
