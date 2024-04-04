import { Button } from "@/components/ui/button";
import { ArrowDownToDot, Menu, MoveUp } from "lucide-react";
import { useRef, useState } from "react";
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
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  const autoScroll = () => {
    if (isAutoScrolling) {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
      setIsAutoScrolling(false);
    } else {
      scrollInterval.current = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.pageYOffset + window.innerHeight;
        if (scrollPosition >= scrollHeight) {
          if (scrollInterval.current) {
            clearInterval(scrollInterval.current);
          }
          setIsAutoScrolling(false);
        } else {
          window.scrollBy({
            top: 5, // Reduced this value to make the auto scroll smoother
            behavior: "smooth",
          });
        }
      }, 50); // Change this value to adjust the frequency of the auto scroll
      setIsOpen(!isOpen);
      setIsAutoScrolling(true);
    }
  };

  const quitAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
    setIsAutoScrolling(false);
    setIsOpen(false);
  };
  return (
    <>
      <div
        className={`fixed bottom-12 right-12 text-4xl px-4 py-2 ${
          isOpen ? "open" : ""
        } ${className}`}
      >
        <Button
          title="Menu"
          variant="default"
          className={`absolute transition-all duration-300 ease-in-out z-10  ${
            isOpen ? "transform scale-125" : "opacity-80 hover:opacity-100"
          } ${isAutoScrolling ? "hidden" : ""}`}
          onClick={() => !isAutoScrolling && setIsOpen(!isOpen)}
          disabled={isAutoScrolling}
        >
          <Menu />
        </Button>

        <Button
          title="Retour en haut"
          variant="default"
          className={`absolute transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 transform  -translate-y-32" : "opacity-0"
          } ${isAutoScrolling ? "hidden" : ""}`}
          onClick={() => window.scrollTo(0, 0)}
          disabled={isAutoScrolling}
        >
          <MoveUp />
        </Button>

        <Button
          title="Scroll Automatique"
          variant="default"
          className={`absolute transition-all duration-300 ease-in-out ${
            isOpen || isAutoScrolling
              ? "opacity-100 transform -translate-x-16 -translate-y-32"
              : "opacity-0"
          } ${isAutoScrolling ? "hidden" : ""}`}
          onClick={autoScroll}
          disabled={isAutoScrolling}
        >
          <ArrowDownToDot />
        </Button>

        <Button
          title="Plein écran"
          variant="default"
          className={`absolute transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 transform -translate-x-32 -translate-y-16"
              : "opacity-0"
          } ${isAutoScrolling ? "hidden" : ""}`}
          disabled={isAutoScrolling}
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
      <Button
        title="Scroll Automatique"
        variant="default"
        className={`fixed bottom-16 right-2  transition-all duration-300 ease-in-out ${
          isAutoScrolling ? "opacity-70" : "opacity-0"
        }`}
        onClick={quitAutoScroll}
      >
        <ArrowDownToDot />
      </Button>
    </>
  );
};
