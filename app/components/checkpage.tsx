"use client";
import { useState } from "react";
import MangaPage from "./mangapage";

interface Volume {
  name: string;
  firstImage: string;
  totalPages: number;
}

interface CheckPageProps {
  params: { slug: string; volume: string };
  totalPages: number;
  volumes: Volume[];
  currentVolume: string;
}

export default function CheckPage({
  params,
  totalPages,
  volumes,
  currentVolume,
}: CheckPageProps) {
  const { slug, volume } = params;

  const getInitialPageNumber = () => {
    if (typeof window !== "undefined") {
      const storedState = localStorage.getItem("mangaInfo");
      if (storedState) {
        const mangaInfos = JSON.parse(storedState);
        if (Array.isArray(mangaInfos)) {
          const mangaInfo = mangaInfos.find(
            (info: { manga: string; volume: string }) =>
              info.manga === slug && info.volume === volume
          );
          return mangaInfo ? mangaInfo.page : 1;
        }
      }
    }
    return 1;
  };

  const [initialPageNumber, setInitialPageNumber] = useState<number>(
    getInitialPageNumber()
  );

  return (
    <MangaPage
      slug={slug}
      volume={volume}
      initialPageNumber={initialPageNumber}
      totalPages={totalPages}
      volumes={volumes}
      currentVolume={currentVolume}
    />
  );
}
