"use client";
import { useState } from "react";
import MangaPage from "./mangapage";

export default function CheckPage({
  params,
}: {
  params: { slug: string; volume: string };
}) {
  const { slug, volume } = params;

  const getInitialPageNumber = () => {
    if (typeof window !== "undefined") {
      // Vérifiez si window est défini (c'est-à-dire, si nous sommes côté client)
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
    />
  );
}
