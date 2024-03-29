"use client";
// VolumeSelect.tsx
import Link from "next/link";
import { useEffect, useState } from "react";

type Volume = {
  name: string;
  firstImage: string;
};

export default function VolumeSelect({
  volumes,
  slug,
  currentVolume,
  isPage,
}: {
  volumes: Volume[];
  slug: string;
  currentVolume: string;
  isPage: boolean;
}) {
  const [selectedVolume, setSelectedVolume] = useState(currentVolume || "");
  const [currentVolumeFromUrl, setCurrentVolumeFromUrl] = useState("");

  const handleChange = (e: { target: { value: string } }) => {
    setSelectedVolume(e.target.value);
  };

  useEffect(() => {
    setSelectedVolume(currentVolume || volumes[0]?.name || "");
  }, [currentVolume, volumes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const volumeFromUrl = currentPath
        .split("/")
        .pop()
        ?.replace("Tome%20", "");
      setCurrentVolumeFromUrl(volumeFromUrl || "");
    }
  }, [typeof window !== "undefined" ? window.location.pathname : ""]);
  const previousVolume = (parseInt(currentVolumeFromUrl) - 1)
    .toString()
    .padStart(2, "0");
  const nextVolume = (parseInt(currentVolumeFromUrl) + 1)
    .toString()
    .padStart(2, "0");

  const formatVolume = (volume: string) => {
    if (volume.startsWith("Tome ")) {
      return volume.slice(5);
    }
    return volume;
  };

  const nextVolumeExists = volumes.some(
    (volume) => formatVolume(volume.name) === nextVolume
  );

  return (
    <div className="flex flex-wrap">
      {currentVolume && (
        <div className="flex justify-center space-x-2">
          <Link href={`/manga/${slug}/Tome%20${previousVolume}`}>
            <p
              className={`inline-block px-4 py-2 text-xs leading-6 text-center text-white uppercase transition rounded shadow hover:shadow-lg focus:outline-none ${
                parseInt(previousVolume) > 0
                  ? "bg-blue-700 hover:bg-blue-800 cursor-pointer"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
              onClick={
                parseInt(previousVolume) > 0
                  ? undefined
                  : (e) => e.preventDefault()
              }
            >
              Chapitre précédent
            </p>
          </Link>
          <Link href={`/manga/${slug}/Tome%20${nextVolume}`}>
            <p
              className={`inline-block px-4 py-2 text-xs leading-6 text-center text-white uppercase transition rounded shadow hover:shadow-lg focus:outline-none ${
                nextVolumeExists
                  ? "bg-blue-700 hover:bg-blue-800 cursor-pointer"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
              onClick={nextVolumeExists ? undefined : (e) => e.preventDefault()}
            >
              Chapitre suivant
            </p>
          </Link>
        </div>
      )}
      <select
        value={isPage ? formatVolume(selectedVolume) : selectedVolume}
        onChange={handleChange}
        className="mx-2 shadow-md rounded-lg overflow-hidden max-w-sm p-2 text-center bg-gray-700 text-white"
      >
        {volumes
          .sort((a, b) => {
            const volumeANumber = parseInt(a.name.replace("Tome ", ""));
            const volumeBNumber = parseInt(b.name.replace("Tome ", ""));
            return volumeANumber - volumeBNumber;
          })
          .map((volume, index) => (
            <option key={index} value={volume.name}>
              {volume.name}
            </option>
          ))}
      </select>
      <Link href={`/manga/${slug}/Tome%20${formatVolume(selectedVolume)}`}>
        <p className="inline-block px-4 py-2 text-xs leading-6 text-center text-white uppercase transition bg-blue-700 rounded shadow hover:shadow-lg hover:bg-blue-800 focus:outline-none">
          Valider
        </p>
      </Link>
    </div>
  );
}
