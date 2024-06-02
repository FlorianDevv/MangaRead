// VolumeSelect.tsx
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Volume = {
  name: string;
  totalPages: number;
  type: string;
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
      router.push(`/manga/${slug}/${formatVolume(volume.name)}`);
    }
  };

  const isWindowDefined = typeof window !== "undefined";

  useEffect(() => {
    setSelectedVolume(currentVolume || volumes[0]?.name || "");
  }, [currentVolume, volumes]);

  useEffect(() => {
    const currentPath = isWindowDefined ? window.location.pathname : "";
    const volumeFromUrl = currentPath.split("/").pop();
    setCurrentVolumeFromUrl(volumeFromUrl || "");
  }, [isWindowDefined]);

  const previousVolume = (parseInt(currentVolumeFromUrl) - 1).toString();
  const nextVolume = (parseInt(currentVolumeFromUrl) + 1).toString();

  const formatVolume = (volume: string) => {
    return volume;
  };

  const nextVolumeExists = volumes.some(
    (volume) => formatVolume(volume.name) === nextVolume
  );

  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);

  return (
    <div className={`flex flex-wrap items-center justify-center ${className}`}>
      {currentVolume && (
        <div className="flex justify-center space-x-2">
          {parseInt(previousVolume) > 0 ? (
            <Link href={`/manga/${slug}/${previousVolume}`}>
              <Button
                variant="secondary"
                className="inline-block px-4 py-2 text-center uppercase focus:outline-none hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
              >
                {data.volumeSelect.previous}
              </Button>
            </Link>
          ) : (
            <Button
              variant="secondary"
              className="inline-block px-4 py-2 text-center uppercase focus:outline-none opacity-50 cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
            >
              {data.volumeSelect.previous}
            </Button>
          )}

          {nextVolumeExists ? (
            <Link href={`/manga/${slug}/${nextVolume}`}>
              <Button
                variant="secondary"
                className="inline-block px-4 py-2 text-center uppercase focus:outline-none hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
              >
                {data.volumeSelect.next}
              </Button>
            </Link>
          ) : (
            <Button
              variant="secondary"
              className="inline-block px-4 py-2 text-center uppercase focus:outline-none opacity-50 cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
            >
              {data.volumeSelect.next}
            </Button>
          )}
        </div>
      )}
      <div className="flex flex-wrap justify-center mt-2 w-full">
        <Select
          name="volume"
          value={formatVolume(selectedVolume)}
          onValueChange={handleChange}
        >
          <SelectTrigger
            className="mx-2 shadow-md rounded-md overflow-hidden max-w-sm p-2 text-center hover:opacity-75 focus:outline-none ease-in-out transition-opacity duration-300 cursor-pointer w-auto"
            aria-label={`Changer de volume. actuellement sur le volume  ${selectedVolume} `}
          >
            {volumes.length > 0
              ? volumes[0].type + " " + formatVolume(selectedVolume)
              : selectedVolume}
          </SelectTrigger>
          <SelectContent>
            {volumes
              .sort((a, b) => {
                const volumeANumber = parseInt(formatVolume(a.name));
                const volumeBNumber = parseInt(formatVolume(b.name));
                return volumeANumber - volumeBNumber;
              })
              .map((volume, index) => (
                <SelectItem key={index} value={volume.name}>
                  {volumes.length > 0
                    ? volumes[0].type + " " + volume.name
                    : volume.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {!isPage && (
          <Link href={`/manga/${slug}/${selectedVolume}`}>
            <Button
              variant="secondary"
              className="inline-block px-4 py-2 text-center uppercase focus:outline-none hover:opacity-75 ease-in-out transition-opacity duration-300 cursor-pointer"
            >
              {data.volumeSelect.start}
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
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
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
            <DialogTitle>{data.volumeSelect.dialog.title}</DialogTitle>
            <DialogDescription>
              {data.volumeSelect.dialog.desc}
            </DialogDescription>
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
