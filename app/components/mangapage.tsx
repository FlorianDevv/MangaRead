"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
// components/MangaPage.tsx

import { Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FloatingButton } from "./floatingButtons";
import { MobileNavbarComponent } from "./mobilenavbar";
import { NavbarContext } from "./navbarcontext";
import { Quality, Read, getSettings } from "./settings";

type Volume = {
  name: string;
  firstImage: string;
  totalPages: number;
};

type MangaPageProps = {
  slug: string;
  volume: string;
  initialPageNumber: number;
  totalPages: number;
  volumes: Volume[];
};

export default function MangaPage({
  slug,
  volume,
  initialPageNumber,
  totalPages,
  volumes,
}: MangaPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(initialPageNumber);
  const volumeWithSpace = volume.replace(/%20/g, " ");
  const volumeNumber = Number(volumeWithSpace.split(" ")[1]);
  const formattedVolume = String(volumeNumber).padStart(2, "0");
  const { read } = getSettings();
  const [isVertical, setIsVertical] = useState(read === "vertical");

  useEffect(() => {
    const handleSettingsChange = () => {
      const { read } = getSettings();
      setIsVertical(read === "vertical");
    };

    // Listen for the custom event
    window.addEventListener("settingsUpdated", handleSettingsChange);

    // Cleanup function
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsChange);
    };
  }, []);

  const { qualityNumber } = getSettings();
  const [quality, setQuality] = useState(qualityNumber);

  useEffect(() => {
    const handleSettingsChange = () => {
      const { quality: newQuality } = getSettings();
      setQuality(newQuality);
    };

    window.addEventListener("settingsUpdated", handleSettingsChange);

    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsChange);
    };
  }, []);
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
      if (isVertical) {
        return;
      }

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
  }, [nextPageExists, previousPage, nextPage, isVertical]);
  const totalVolumes = volumes.length;
  useEffect(() => {
    let existingMangaInfo = JSON.parse(
      localStorage.getItem("mangaInfo") || "[]"
    );

    if (!Array.isArray(existingMangaInfo)) {
      existingMangaInfo = [];
    }

    const existingMangaIndex = existingMangaInfo.findIndex(
      (info: { manga: string }) => info.manga === slug
    );

    const mangaInfo = {
      manga: slug,
      volume: volume,
      page: pageNumber,
      totalVolumes: totalVolumes,
      dateWatched:
        existingMangaInfo[existingMangaIndex]?.dateWatched || Date.now(),
    };

    if (existingMangaIndex !== -1) {
      existingMangaInfo[existingMangaIndex] = mangaInfo;
    } else {
      existingMangaInfo.push(mangaInfo);
    }

    localStorage.setItem("mangaInfo", JSON.stringify(existingMangaInfo));
  }, [slug, volume, pageNumber, totalVolumes]);

  const formattedPageNumber = String(pageNumber).padStart(3, "0");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageName = `${formattedVolume}-${formattedPageNumber}`;
  const images = Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    if (isNaN(pageNumber)) {
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
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (!isVertical) {
      setIsVisible(true);
    }
  }, [isVertical]);
  useEffect(() => {
    const handleScroll = () => {
      if (isVertical) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVertical]);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  let lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      setIsScrollingUp(lastScrollY.current > currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <NavbarContext.Provider value={{ isVisible, setIsVisible }}>
      <MobileNavbarComponent>
        <>
          <div className="flex justify-center ">
            {SelectPageNumber(pageNumber, setPageNumber, totalPages)}
            <Fullscreen
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
            />
          </div>
          <div className="flex justify-center space-x-4 ">
            <Quality qualityNumber={quality} setQuality={setQuality} />

            <Read isVertical={isVertical} setIsVertical={setIsVertical} />
          </div>
          <div className="relative min-h-screen w-screen mt-2">
            {!isVertical && (
              <Image
                src={`/${slug}/manga/${volume}/${imageName}.webp`}
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
                  src={`/${slug}/manga/${volume}/${nextImageName}.webp`}
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
                      ref={(ref: HTMLDivElement | null) => {
                        if (ref) {
                          imageRefs.current[index] = ref;
                        }
                      }}
                    >
                      <Image
                        id={`image-${index}`}
                        src={`/${slug}/manga/${volume}/${imageName}.webp`}
                        alt={`${slug} Page ${index + 1}`}
                        width={3840}
                        height={2160}
                        style={{ objectFit: "contain" }}
                        sizes="125vw"
                        quality={quality}
                        loading="lazy"
                        onLoad={() => {
                          if (index + 1 === pageNumber && isLoading) {
                            imageRefs.current[index]?.scrollIntoView();
                            setIsLoading(false);
                          }
                        }}
                        onClick={async () => {
                          setPageNumber(index + 1);
                          await new Promise((resolve) =>
                            setTimeout(resolve, 10)
                          );
                          setIsLoading(false);
                          setTimeout(() => setIsVisible(true), 10);
                        }}
                        className={
                          isFullscreen ? "" : "mx-auto lg:max-w-screen-lg"
                        }
                      />
                    </div>
                  ))}
                  {isLoading && (
                    <div className="loading-screen">
                      <div className="spinner"></div>
                    </div>
                  )}

                  <FloatingButton
                    className={`transition-all ease-in-out duration-300 transform ${
                      isScrollingUp
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    qualityNumber={quality || 0}
                    setQuality={setQuality}
                    setIsVertical={setIsVertical}
                    isVertical={isVertical}
                    volumes={[...volumes]}
                    slug={slug}
                    currentVolume={decodeURIComponent(volume)}
                    isFullscreen={isFullscreen}
                    setIsFullscreen={setIsFullscreen}
                  />
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
        </>
      </MobileNavbarComponent>
    </NavbarContext.Provider>
  );
}
//---------------------------------------------

function SelectPageNumber(
  pageNumber: number,
  setPageNumber: (arg0: number) => void,
  totalPages: number
) {
  return (
    <Select
      onValueChange={(value: string) =>
        setPageNumber(Number(value.split(" / ")[0]))
      }
    >
      <SelectTrigger
        className="m-2 overflow-hidden max-w-sm p-2 hover:opacity-75 focus:outline-none ease-in-out transition-opacity duration-300 cursor-pointer w-auto"
        aria-label={`Changer de page. Page actuelle: ${pageNumber} page sur ${totalPages} pages`}
      >
        {`${pageNumber} / ${totalPages}`}
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <SelectItem key={num} value={`${num} / ${totalPages}`}>
            {`${num} / ${totalPages}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface FullscreenProps {
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Utilisez le contexte dans le composant Fullscreen
export function Fullscreen({ isFullscreen, setIsFullscreen }: FullscreenProps) {
  const { setIsVisible } = useContext(NavbarContext);

  const goFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    document.body.classList.add("fullscreen");
    setIsFullscreen(true);
    setIsVisible(false);
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
    document.body.classList.remove("fullscreen");
    setIsFullscreen(false);
    setIsVisible(true);
  };

  return (
    <button
      className={`justify-center hover:scale-115 hover:opacity-75 transform transition-transform duration-300 `}
      onClick={isFullscreen ? exitFullScreen : goFullScreen}
      title="Fullscreen"
    >
      {isFullscreen ? <Minimize2 /> : <Maximize2 />}
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
