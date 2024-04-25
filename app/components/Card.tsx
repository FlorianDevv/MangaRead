// MangaCard.tsx
import Link from "next/link";
import DynamicBlur from "./dynamicBlur";

interface CardProps {
  Name: string;
  type: "manga" | "anime" | "both";
}

export default function Card({ Name, type }: CardProps) {
  const imagePath =
    type === "anime"
      ? `/${Name}/anime/Season01/01-001.webp`
      : `/${Name}/manga/Tome 01/01-001.webp`;

  return (
    <div className="relative flex flex-col items-stretch rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform group hover:scale-105 transition-transform duration-300 w-full">
      <Link key={Name} href={`/manga/${Name}`}>
        <div className="relative flex flex-col items-stretch shine">
          <DynamicBlur
            src={imagePath}
            alt={Name}
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
        <h1 className="text-xs sm:text-sm md:text-base text-center  transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words p-2">
          {Name}
        </h1>
      </Link>
    </div>
  );
}
