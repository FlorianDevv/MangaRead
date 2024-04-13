"use client";
import { useEffect, useState } from "react";
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

  const [initialPageNumber] = useState<number>(getInitialPageNumber());
  useEffect(() => {
    const totalVolumes = volumes.length;
    let mangaInfos = JSON.parse(localStorage.getItem("mangaInfo") || "[]");
    const mangaInfoIndex = mangaInfos.findIndex(
      (info: { manga: string; volume: string }) =>
        info.manga === slug && info.volume === volume
    );

    if (mangaInfoIndex !== -1) {
      const updatedMangaInfo = mangaInfos[mangaInfoIndex];
      updatedMangaInfo.totalVolumes = totalVolumes;
      mangaInfos = mangaInfos.filter(
        (_: any, index: number) => index !== mangaInfoIndex
      );
      mangaInfos.push(updatedMangaInfo);
    } else {
      mangaInfos.push({
        manga: slug,
        volume: volume,
        page: initialPageNumber,
        totalVolumes: totalVolumes,
      });
    }

    mangaInfos = mangaInfos.reverse(); // Reverse the order of the array

    localStorage.setItem("mangaInfo", JSON.stringify(mangaInfos));
  }, [initialPageNumber, slug, volume, volumes]);

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
