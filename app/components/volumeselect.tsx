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
}: {
  volumes: Volume[];
  slug: string;
  currentVolume: string;
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

  return (
    <div className="flex flex-wrap">
      {currentVolume && (
        <div>
          <Link href={`/manga/${slug}/Tome%20${previousVolume}`}>
            <p className="inline-block px-4 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-700 rounded shadow ripple hover:shadow-lg hover:bg-blue-800 focus:outline-none">
              Previous
            </p>
          </Link>
          <Link href={`/manga/${slug}/Tome%20${nextVolume}`}>
            <p className="inline-block px-4 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-700 rounded shadow ripple hover:shadow-lg hover:bg-blue-800 focus:outline-none">
              Next
            </p>
          </Link>
        </div>
      )}
      <select
        value={selectedVolume}
        onChange={handleChange}
        className="mx-2 shadow-md rounded-lg overflow-hidden max-w-sm p-2 text-center bg-gray-700 text-white"
      >
        {volumes.map((volume, index) => (
          <option key={index} value={volume.name}>
            {volume.name}
          </option>
        ))}
      </select>
      <Link href={`/manga/${slug}/Tome%20${formatVolume(selectedVolume)}`}>
        <p className="inline-block px-4 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-700 rounded shadow ripple hover:shadow-lg hover:bg-blue-800 focus:outline-none">
          Go to volume
        </p>
      </Link>
    </div>
  );
}
