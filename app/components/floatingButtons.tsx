import { Button } from "@/components/ui/button";
import { Home, Menu, MoveUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Fullscreen } from "./mangapage";
import { SettingsDialog } from "./settings";
import { VolumeSelectDialog } from "./volumeselect";

type Volume = {
  name: string;
  firstImage: string;
};

interface FloatingButtonProps {
  qualityNumber: number;
  setQuality: (value: number) => void;
  setIsVertical: (value: boolean) => void;
  isVertical: boolean;
  volumes: Volume[];
  slug: string;
  currentVolume: string;
  className?: string;
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  qualityNumber,
  setQuality,
  setIsVertical,
  isVertical,
  volumes,
  slug,
  currentVolume,
  className,
  isFullscreen,
  setIsFullscreen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed bottom-12 right-12 text-4xl px-4 py-2 ${
          isOpen ? "open" : ""
        } ${className}`}
      >
        <Button
          title="Menu"
          className={`absolute transition-all duration-300 ease-in-out z-10  ${
            isOpen ? "transform scale-125" : "opacity-80 hover:opacity-100"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>

        <Button
          title="Retour en haut"
          className={`absolute transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 transform  -translate-y-32" : "opacity-0"
          }`}
          onClick={() => window.scrollTo(0, 0)}
        >
          <MoveUp />
        </Button>
        <Link href="/">
          <Button
            title="Accueil"
            className={`absolute transition-all duration-300 ease-in-out ${
              isOpen
                ? "opacity-100 transform -translate-x-16 -translate-y-32"
                : "opacity-0"
            }`}
          >
            <Home />
          </Button>
        </Link>

        <Button
          title="Plein écran"
          className={`absolute transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 transform -translate-x-32 -translate-y-16"
              : "opacity-0"
          }`}
        >
          <Fullscreen
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        </Button>

        <SettingsDialog
          isOpen={isOpen}
          classNames={[
            "absolute",
            "transition-all",
            "duration-300",
            "ease-in-out",
            "z-10",
            isOpen
              ? "opacity-100 transform -translate-x-32 -translate-y-0"
              : "opacity-0",
          ]}
          settings={{ qualityNumber, setQuality, setIsVertical, isVertical }}
        />

        <VolumeSelectDialog
          isPage={true}
          isOpen={isOpen}
          volumes={volumes}
          slug={slug}
          currentVolume={currentVolume}
          classNames={[
            "absolute",
            "transition-all",
            "duration-300",
            "ease-in-out",
            "z-10",
            isOpen
              ? "opacity-100 transform -translate-x-32 -translate-y-32"
              : "opacity-0",
          ]}
        />
      </div>
    </>
  );
};
