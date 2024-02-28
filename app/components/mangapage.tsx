"use client";
// components/MangaPage.tsx

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type MangaPageProps = {
  slug: string;
  volume: string;
  initialPageNumber: number;
};

export default function MangaPage({
  slug,
  volume,
  initialPageNumber,
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
    for (let i = 1; i <= 3; i++) {
      const nextFormattedPageNumber = String(pageNumber + i).padStart(3, "0");
      const nextImageName = `${formattedVolume}-${nextFormattedPageNumber}`;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = `/${slug}/${volume}/${nextImageName}.webp`;
      document.head.appendChild(link);
    }
  }, [formattedVolume, pageNumber, slug, volume]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          previousPage();
          break;
        case "ArrowRight":
          if (nextPageExists) {
            nextPage();
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

    // Récupérer le tableau existant
    let existingMangaInfo = JSON.parse(
      localStorage.getItem("mangaInfo") || "[]"
    );

    // Vérifier si existingMangaInfo est un tableau
    if (!Array.isArray(existingMangaInfo)) {
      existingMangaInfo = [];
    }

    // Vérifier si le manga existe déjà
    const existingMangaIndex = existingMangaInfo.findIndex(
      (info: { manga: string }) => info.manga === slug
    );

    if (existingMangaIndex !== -1) {
      // Si le manga existe déjà, le mettre à jour
      existingMangaInfo[existingMangaIndex] = mangaInfo;
    } else {
      // Sinon, ajouter le nouvel objet
      existingMangaInfo.push(mangaInfo);
    }

    // Stocker le tableau à nouveau
    localStorage.setItem("mangaInfo", JSON.stringify(existingMangaInfo));
  }, [slug, volume, pageNumber]);

  const formattedPageNumber = String(pageNumber).padStart(3, "0");
  const imageName = `${formattedVolume}-${formattedPageNumber}`;

  const nextFormattedPageNumber = String(pageNumber + 1).padStart(3, "0");
  const nextImageName = `${formattedVolume}-${nextFormattedPageNumber}`;

  const previousFormattedPageNumber = String(pageNumber - 1).padStart(3, "0");
  const previousImageName = `${formattedVolume}-${previousFormattedPageNumber}`;

  return (
    <div>
      <div className="flex justify-center text-white">
        <p className="text-xl m-4"> Page {pageNumber} </p>
        <button
          className="justify-center"
          onClick={goFullScreen}
          title="Plein écran"
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
          alt={`Page ${pageNumber}`}
          layout="fill"
          objectFit="contain"
          priority={true}
        />
        {pageNumber > 1 && (
          <Image
            src={`/${slug}/${volume}/${previousImageName}.webp`}
            alt={`Page ${pageNumber - 1}`}
            layout="fill"
            objectFit="contain"
            priority={true}
            className="hidden"
          />
        )}
        {nextPageExists && (
          <Image
            src={`/${slug}/${volume}/${nextImageName}.webp`}
            alt={`Page ${pageNumber + 1}`}
            layout="fill"
            objectFit="contain"
            priority={true}
            className="hidden"
          />
        )}
        <button
          className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1/10 h-full opacity-0 hover:opacity-100 flex items-center justify-start ml-4"
          onClick={previousPage}
          title="Page précédente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="blue"
            className="h-12 w-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-1/10 h-full opacity-0 hover:opacity-100 flex items-center justify-end mr-4 ${
            nextPageExists ? "" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={nextPageExists ? nextPage : undefined}
          title="Page suivante"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="blue"
            className="h-12 w-12"
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
