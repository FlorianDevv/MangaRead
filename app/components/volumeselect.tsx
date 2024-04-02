"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Navigation } from "lucide-react";
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

  const handleChange = (value: string) => {
    setSelectedVolume(value);
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
          {parseInt(previousVolume) > 0 ? (
            <Link href={`/manga/${slug}/Tome%20${previousVolume}`}>
              <Button
                variant="secondary"
                className="inline-block px-4 py-2 text-center uppercase focus:outline-none hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
              >
                Volume précédent
              </Button>
            </Link>
          ) : (
            <Button
              variant="secondary"
              className="inline-block px-4 py-2 text-center uppercase focus:outline-none opacity-50 cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
            >
              Volume précédent
            </Button>
          )}

          {nextVolumeExists ? (
            <Link href={`/manga/${slug}/Tome%20${nextVolume}`}>
              <Button
                variant="secondary"
                className="inline-block px-4 py-2 text-center uppercase focus:outline-none hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
              >
                Volume suivant
              </Button>
            </Link>
          ) : (
            <Button
              variant="secondary"
              className="inline-block px-4 py-2 text-center uppercase focus:outline-none opacity-50 cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
            >
              Volume suivant
            </Button>
          )}
        </div>
      )}
      <Select
        name="volume"
        value={isPage ? formatVolume(selectedVolume) : selectedVolume}
        onValueChange={handleChange}
      >
        <SelectTrigger className="mx-2 shadow-md rounded-md overflow-hidden max-w-sm p-2 text-center hover:opacity-75 focus:outline-none ease-in-out transition-opacity duration-300 cursor-pointer w-auto">
          {isPage ? formatVolume(selectedVolume) : selectedVolume}
        </SelectTrigger>
        <SelectContent>
          {volumes
            .sort((a, b) => {
              const volumeANumber = parseInt(a.name.replace("Tome ", ""));
              const volumeBNumber = parseInt(b.name.replace("Tome ", ""));
              return volumeANumber - volumeBNumber;
            })
            .map((volume, index) => (
              <SelectItem key={index} value={volume.name}>
                {volume.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Link href={`/manga/${slug}/Tome%20${formatVolume(selectedVolume)}`}>
        <Button
          variant="secondary"
          className={`inline-block px-4 py-2 text-center uppercase focus:outline-none hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer`}
        >
          Valider
        </Button>
      </Link>
    </div>
  );
}

interface VolumeSelectDialogProps {
  isOpen: boolean;
  volumes: Volume[];
  slug: string;
  currentVolume: string;
  classNames?: string[];
}

export const VolumeSelectDialog: React.FC<VolumeSelectDialogProps> = ({
  isOpen,
  volumes,
  slug,
  currentVolume,
  classNames,
}) => {
  const decodedVolume = currentVolume.replace(/\D/g, "");
  return (
    <div
      className={`${classNames?.join(" ")} ${
        isOpen ? "" : "opacity-0 pointer-events-none"
      }`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" title="Navigation">
            <Navigation />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Navigation</DialogTitle>
            <DialogDescription>Changer de volume rapidement</DialogDescription>
          </DialogHeader>
          <VolumeSelect
            volumes={volumes}
            slug={slug}
            currentVolume={decodedVolume}
            isPage={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
