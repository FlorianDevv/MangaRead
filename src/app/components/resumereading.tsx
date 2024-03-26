// ResumeReading.tsx
// ResumeReading.tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import "../scrollbar.css";
import NavigationLink from "./navigationLink";
type ResumeReadingProps = {
  resumeTrad: string;
};
export default function ResumeReading({ resumeTrad }: ResumeReadingProps) {
  const [state, setState] = useState<
    Array<{
      manga: string;
      volume: string;
      page: number;
    }>
  >([]);

  useEffect(() => {
    const storedState = localStorage.getItem("mangaInfo");
    if (storedState) {
      setState(JSON.parse(storedState));
    }
  }, []);

  if (!state.length) {
    return null;
  }

  return (
    <div>
      <h2 className="w-full text-center text-3xl mb-4 mt-6">{resumeTrad}</h2>
      <div className="flex flex-col items-stretch m-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:opacity-80">
        <div className="flex flex-nowrap justify-center items-center overflow-x-auto">
          {state.map((mangaInfo, index) => (
            <NavigationLink
              key={index}
              href={`/manga/${mangaInfo.manga}/${mangaInfo.volume}/`}
            >
              <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 flex-shrink-0">
                <Image
                  src={`/${mangaInfo.manga}/Tome 01/01-001.webp`}
                  alt={mangaInfo.manga}
                  quality={1}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="90vw"
                  className="transition-all duration-500 ease-in-out transform 5  "
                />
              </div>
              <div className="p-2 flex-grow">
                <p className="text-sm text-center text-white">
                  {mangaInfo.manga} <br></br> Volume{" "}
                  {decodeURIComponent(mangaInfo.volume).split(" ")[1]} <br></br>{" "}
                  Page {mangaInfo.page}
                </p>
              </div>
            </NavigationLink>
          ))}
        </div>
      </div>
    </div>
  );
}
