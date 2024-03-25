"use client";
// components/MangaPage.tsx

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type MangaPageProps = {
  slug: string;
  volume: string;
  initialPageNumber: number;
  totalPages: number;
};

export default function MangaPage({
  slug,
  volume,
  initialPageNumber,
  totalPages,
}: MangaPageProps) {
  const [pageNumber, setPageNumber] = useState(initialPageNumber);
  const volumeWithSpace = volume.replace(/%20/g, " ");
  const volumeNumber = Number(volumeWithSpace.split(" ")[1]);
  const formattedVolume = String(volumeNumber).padStart(2, "0");

  const goFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };
  const [nextPageExists, setNextPageExists] = useState(true);

  const nextPage = useCallback(() => {
    setPageNumber(pageNumber + 1);
  }, [pageNumber]);

  const previousPage = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }, [pageNumber]);

  const checkNextPageExists = useCallback(async () => {
    const nextFormattedPageNumber = String(pageNumber + 1).padStart(3, "0");
    const nextImageName = `${formattedVolume}-${nextFormattedPageNumber}`;
    const imageUrl = `/${slug}/${volume}/${nextImageName}.webp`;

    const response = await fetch(imageUrl, { method: "HEAD" });
    setNextPageExists(response.status === 200);
  }, [pageNumber, formattedVolume, slug, volume]);

  useEffect(() => {
    checkNextPageExists();
  }, [checkNextPageExists, formattedVolume, pageNumber, slug, volume]);

  useEffect(() => {
    const checkNextPageExists = async (
      nextImageName: string
    ): Promise<boolean> => {
      const imageUrl = `/${slug}/${volume}/${nextImageName}.webp`;
      const response = await fetch(imageUrl, { method: "HEAD" });
      return response.status === 200;
    };

    const preloadNextPages = async () => {
      for (let i = 2; i <= 8; i++) {
        const nextFormattedPageNumber = String(pageNumber + i).padStart(3, "0");
        const nextImageName = `${formattedVolume}-${nextFormattedPageNumber}`;

        if (await checkNextPageExists(nextImageName)) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = `/${slug}/${volume}/${nextImageName}.webp`;
          link.crossOrigin = "anonymous";
          document.head.appendChild(link);
        }
      }
    };

    preloadNextPages();
  }, [formattedVolume, pageNumber, slug, volume, checkNextPageExists]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          previousPage();
          break;
        case "ArrowRight":
          if (nextPageExists) {
            nextPage();
          } else {
            alert("last page");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextPageExists, previousPage, nextPage]);

  useEffect(() => {
    const mangaInfo = {
      manga: slug,
      volume: volume,
      page: pageNumber,
    };

    let existingMangaInfo = JSON.parse(
      localStorage.getItem("mangaInfo") || "[]"
    );

    if (!Array.isArray(existingMangaInfo)) {
      existingMangaInfo = [];
    }

    const existingMangaIndex = existingMangaInfo.findIndex(
      (info: { manga: string }) => info.manga === slug
    );

    if (existingMangaIndex !== -1) {
      existingMangaInfo[existingMangaIndex] = mangaInfo;
    } else {
      existingMangaInfo.push(mangaInfo);
    }

    // Stocker le tableau à nouveau
    localStorage.setItem("mangaInfo", JSON.stringify(existingMangaInfo));
  }, [slug, volume, pageNumber]);

  const formattedPageNumber = String(pageNumber).padStart(3, "0");
  const imageName = `${formattedVolume}-${formattedPageNumber}`;

  const nextFormattedPageNumber = String(pageNumber + 1).padStart(3, "0");
  const nextImageName = `${formattedVolume}-${nextFormattedPageNumber}`;

  return (
    <div>
      <div className="flex justify-center text-white">
        <select
          value={`${pageNumber} / ${totalPages}`}
          onChange={(e) =>
            setPageNumber(Number(e.target.value.split(" / ")[0]))
          }
          className="m-2 shadow-md rounded-lg overflow-hidden max-w-sm p-2 text-center bg-gray-700 text-white"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <option key={num} value={`${num} / ${totalPages}`}>
              {num} / {totalPages}
            </option>
          ))}
        </select>
        <button
          className="justify-center"
          onClick={goFullScreen}
          title="Fullscreen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 3h5m0 0v5m0-5l-7 7m7-7l-7 7M9 21H4m0 0v-5m0 5l7-7m-7 7l7-7"
            />
          </svg>
        </button>
      </div>
      <div className="relative h-screen w-screen">
        <Image
          src={`/${slug}/${volume}/${imageName}.webp`}
          alt={`${slug} Page ${pageNumber}`}
          style={{ objectFit: "contain" }}
          sizes="100vw"
          quality={100}
          fill
          priority
        />
        {nextPageExists && (
          <Image
            src={`/${slug}/${volume}/${nextImageName}.webp`}
            alt={`${slug} Page ${pageNumber + 1}`}
            style={{ objectFit: "contain" }}
            sizes="100vw"
            quality={100}
            fill
            priority
            className="hidden"
          />
        )}
        {pageNumber > 1 && (
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1/5 h-full opacity-0 hover:opacity-70 flex items-center justify-start ml-4"
            onClick={previousPage}
            title="Page précédente"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="blue"
              className="h-16 w-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <button
          className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-1/5 h-full opacity-0 hover:opacity-70 flex items-center justify-end mr-4 ${
            nextPageExists ? "" : "cursor-not-allowed"
          }`}
          onClick={nextPageExists ? nextPage : undefined}
          title="Page suivante"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="blue"
            className="h-16 w-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
