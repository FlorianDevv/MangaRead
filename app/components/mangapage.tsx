"use client";
// components/MangaPage.tsx

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [quality, setQuality] = useState(75);

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageName = `${formattedVolume}-${formattedPageNumber}`;
  const images = Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    if (isNaN(pageNumber)) {
      console.error("i + 1 is not a number:", i + 1);
      return;
    }

    return `${formattedVolume}-${String(pageNumber).padStart(3, "0")}`;
  });
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isVertical) {
      setIsLoading(true);
      // Scroll to the image corresponding to pageNumber when switching to vertical mode
      imageRefs.current[pageNumber - 1]?.scrollIntoView();
    }
  }, [isVertical, pageNumber]);

  const nextFormattedPageNumber = String(pageNumber + 1).padStart(3, "0");
  const nextImageName = `${formattedVolume}-${nextFormattedPageNumber}`;

  return (
    <div>
      <div className="flex justify-center text-white">
        {SelectPageNumber(pageNumber, setPageNumber, totalPages)}
        <Fullscreen
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
        />
      </div>
      <div className="flex justify-center ">
        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="m-2 shadow-md rounded-lg overflow-hidden max-w-sm bg-sky-900 hover:bg-sky-900"
        />

        <p className={`m-2 ${qualityColor(quality)}`}>
          Qualité: {quality} % - {qualityIndicator(quality)}
        </p>
        <button
          className="p-2 mx-2 text-xs transition bg-blue-700 rounded shadow hover:shadow-lg hover:bg-blue-800 focus:outline-none"
          onClick={() => {
            if (!isLoading) {
              setIsVertical((prevState) => !prevState);
            }
          }}
        >
          {isVertical ? "Vertical" : "Horizontal"}
        </button>
      </div>
      <div className="relative min-h-screen w-screen mt-2">
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
          {isVertical && (
            <>
              {images.map((imageName, index) => (
                <div
                  key={index}
                  ref={(ref) => (imageRefs.current[index] = ref)}
                >
                  <Image
                    id={`image-${index}`}
                    src={`/${slug}/${volume}/${imageName}.webp`}
                    alt={`${slug} Page ${index + 1}`}
                    width={3840}
                    height={2160}
                    style={{ objectFit: "contain" }}
                    sizes="125vw"
                    quality={quality}
                    loading="lazy"
                    onLoad={() => {
                      if (index + 1 === pageNumber) {
                        imageRefs.current[index]?.scrollIntoView();
                        setIsLoading(false);
                      }
                    }}
                    onClick={() => {
                      setPageNumber(index + 1);
                    }}
                    className={isFullscreen ? "" : "mx-auto lg:max-w-screen-lg"}
                  />
                </div>
              ))}
              {isLoading && (
                <div className="loading-screen">
                  <div className="spinner"></div>
                </div>
              )}
              <button
                className="fixed bottom-4 right-4 text-4xl text-sky-900 px-4 py-2 rounded-full opacity-50 hover:opacity-100 ease-in-out transform transition-opacity duration-200 "
                onClick={() => window.scrollTo(0, 0)}
              >
                ↑
              </button>
            </>
          )}
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
//---------------------------------------------
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
function qualityColor(quality: number) {
  if (quality === 100) return "text-green-500";
  if (quality >= 75) return "text-green-400";
  if (quality >= 50) return "text-yellow-500";
  if (quality >= 25) return "text-orange-500";
  return "text-red-500";
}
function qualityIndicator(quality: number) {
  if (quality === 100) return "Sans perte";
  if (quality >= 75) return "Excellent";
  if (quality >= 50) return "Bon";
  if (quality >= 25) return "Moyen";
  return "Faible";
}

interface FullscreenProps {
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

function Fullscreen({
  isFullscreen,
  setIsFullscreen,
  className,
}: FullscreenProps) {
  const goFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  return (
    <button
      className={`justify-center hover:scale-115 hover:opacity-75 transform transition-transform duration-300 `}
      onClick={isFullscreen ? exitFullScreen : goFullScreen}
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
