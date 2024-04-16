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
import { useRouter } from "next/navigation";
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
  className,
}: {
  volumes: Volume[];
  slug: string;
  currentVolume: string;
  isPage: boolean;
  className?: string;
}) {
  const [selectedVolume, setSelectedVolume] = useState(currentVolume || "");
  const [currentVolumeFromUrl, setCurrentVolumeFromUrl] = useState("");
  const router = useRouter();

  const handleChange = (value: string) => {
    setSelectedVolume(value);
    const volume = volumes.find((volume) => volume.name === value);
    if (volume) {
      router.push(`/manga/${slug}/Tome%20${formatVolume(volume.name)}`);
    }
  };

  const isWindowDefined = typeof window !== "undefined";

  useEffect(() => {
    setSelectedVolume(currentVolume || volumes[0]?.name || "");
  }, [currentVolume, volumes]);

  useEffect(() => {
    const currentPath = isWindowDefined ? window.location.pathname : "";
    const volumeFromUrl = currentPath.split("/").pop()?.replace("Tome%20", "");
    setCurrentVolumeFromUrl(volumeFromUrl || "");
  }, [isWindowDefined]);
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
    <div className={`flex flex-wrap items-center justify-center ${className}`}>
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
      <div className="flex flex-wrap justify-center  mt-2 w-full">
        <Select
          name="volume"
          value={isPage ? formatVolume(selectedVolume) : selectedVolume}
          onValueChange={handleChange}
        >
          <SelectTrigger
            className="mx-2 shadow-md rounded-md overflow-hidden max-w-sm p-2 text-center hover:opacity-75 focus:outline-none ease-in-out transition-opacity duration-300 cursor-pointer w-auto"
            aria-label={`Changer de volume. actuellement sur le volume  ${selectedVolume} `}
          >
            {isPage ? "Tome " + formatVolume(selectedVolume) : selectedVolume}
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
                  {isPage ? `Tome ${volume.name}` : volume.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {!isPage && (
          //commencer la lecture button
          <Link href={`/manga/${slug}/${selectedVolume}`}>
            <Button
              variant="secondary"
              className="inline-block px-4 py-2 text-center uppercase focus:outline-none hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
            >
              Commencer la lecture
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

interface VolumeSelectDialogProps {
  isOpen: boolean;
  volumes: Volume[];
  slug: string;
  currentVolume: string;
  classNames?: string[];
  isPage: boolean;
}

export const VolumeSelectDialog: React.FC<VolumeSelectDialogProps> = ({
  isOpen,
  volumes,
  slug,
  currentVolume,
  classNames,
  isPage,
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
          <Button title="Navigation">
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
            isPage={isPage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
