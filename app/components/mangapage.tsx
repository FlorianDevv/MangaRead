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
  const [isLoading, setIsLoading] = useState(true);
  const [isVertical, setIsVertical] = useState(false);

  const [pageNumber, setPageNumber] = useState(initialPageNumber);
  const volumeWithSpace = volume.replace(/%20/g, " ");
  const volumeNumber = Number(volumeWithSpace.split(" ")[1]);
  const formattedVolume = String(volumeNumber).padStart(2, "0");
  const [quality, setQuality] = useState(80);

  const [nextPageExists, setNextPageExists] = useState(true);

  const nextPage = useCallback(() => {
    if (isLoading) {
      return;
    }
    setPageNumber(pageNumber + 1);
    setIsLoading(true);
  }, [pageNumber, isLoading]);

  const previousPage = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }, [pageNumber]);

  const checkNextPageExists = useCallback(() => {
    const nextPageNumber = pageNumber + 1;
    setNextPageExists(nextPageNumber <= totalPages);
  }, [pageNumber, totalPages]);

  useEffect(() => {
    checkNextPageExists();
  }, [checkNextPageExists, formattedVolume, pageNumber, slug, volume]);

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
  const images = Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    if (isNaN(pageNumber)) {
      console.error("i + 1 is not a number:", i + 1);
      return;
    }

    return `${formattedVolume}-${String(pageNumber).padStart(3, "0")}`;
  });

  const nextFormattedPageNumber = String(pageNumber + 1).padStart(3, "0");
  const nextImageName = `${formattedVolume}-${nextFormattedPageNumber}`;

  return (
    <div>
      <div className="flex justify-center text-white">
        {!isVertical && SelectPageNumber(pageNumber, setPageNumber, totalPages)}
        <Fullscreen />
      </div>
      <div className="flex justify-center ">
        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="m-2 shadow-md rounded-lg overflow-hidden max-w-sm   bg-sky-900 hover:bg-sky-900 "
        />
        <p className="m-2 text-white">Qualité: {quality} %</p>
        <button
          className="m-2 shadow-md rounded-lg overflow-hidden max-w-sm p-2 text-center bg-gray-700 text-white"
          onClick={() => setIsVertical(!isVertical)}
        >
          {isVertical ? "Vertical" : "Horizontal"}
        </button>
      </div>
      <div className="relative min-h-screen w-screen">
        {!isVertical && (
          <Image
            src={`/${slug}/${volume}/${imageName}.webp`}
            alt={`${slug} Page ${pageNumber}`}
            style={{ objectFit: "contain" }}
            sizes="125vw"
            quality={quality}
            fill
            priority
            onLoad={() => setIsLoading(false)}
          />
        )}
        {isLoading && !isVertical && (
          <div className="loading-screen">
            <div className="spinner"></div>
          </div>
        )}
        {nextPageExists && !isVertical && (
          <>
            <Image
              src={`/${slug}/${volume}/${nextImageName}.webp`}
              alt={`${slug} Page ${pageNumber + 1}`}
              style={{ objectFit: "contain" }}
              sizes="125vw"
              quality={quality}
              fill
              priority
              className="hidden"
            />
          </>
        )}
        <div className="flex flex-col">
          {isVertical &&
            images.map((imageName, index) => (
              <Image
                key={index}
                src={`/${slug}/${volume}/${imageName}.webp`}
                alt={`${slug} Page ${index + 1}`}
                width={3840}
                height={2160}
                style={{ objectFit: "contain" }}
                sizes="125vw"
                quality={quality}
                priority
              />
            ))}
        </div>
        {pageNumber > 1 && !isVertical && (
          <PreviousPageButton previousPage={previousPage} />
        )}
        {!isVertical && (
          <NextPageButton
            nextPageExists={nextPageExists}
            nextPage={nextPage}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}
//-------------------------------------------------------------------------------------------------------
function SelectPageNumber(
  pageNumber: number,
  setPageNumber: (arg0: number) => void,
  totalPages: number
) {
  return (
    <select
      value={`${pageNumber} / ${totalPages}`}
      onChange={(e) => setPageNumber(Number(e.target.value.split(" / ")[0]))}
      className="m-2 shadow-md rounded-lg overflow-hidden max-w-sm p-2 text-center bg-gray-700 text-white"
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <option key={num} value={`${num} / ${totalPages}`}>
          {num} / {totalPages}
        </option>
      ))}
    </select>
  );
}

function Fullscreen() {
  const goFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };
  return (
    <button
      className="justify-center hover:scale-115 hover:opacity-75 transform transition-transform duration-300"
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
  );
}
interface PreviousPageButtonProps {
  previousPage: () => void;
}
function PreviousPageButton({ previousPage }: PreviousPageButtonProps) {
  return (
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
  );
}
interface NextPageButtonProps {
  nextPageExists: boolean;
  nextPage: () => void;
  disabled: boolean;
}
function NextPageButton({
  nextPageExists,
  nextPage,
  disabled,
}: NextPageButtonProps) {
  return (
    <button
      className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-1/5 h-full opacity-0 hover:opacity-70 flex items-center justify-end mr-4 ${
        nextPageExists ? "" : "cursor-not-allowed"
      }`}
      onClick={nextPageExists ? nextPage : undefined}
      title="Page suivante"
      disabled={disabled}
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
  );
}
