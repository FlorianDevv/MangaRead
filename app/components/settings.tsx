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
import { Slider } from "@/components/ui/slider";
import {
  GalleryHorizontal,
  GalleryVertical,
  Settings,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

export function getSettings() {
  if (typeof window === "undefined") {
    return { qualityNumber: 75, read: "vertical" };
  }

  const settings = JSON.parse(localStorage.getItem("settings") || "[]");
  const quality =
    settings.find((setting: { qualityNumber: number }) => setting.qualityNumber)
      ?.quality || 75;
  const read =
    settings.find((setting: { read: string }) => setting.read)?.read ||
    "vertical";
  return { quality, read };
}

export function updateSettings(newSettings: any) {
  if (typeof window === "undefined") {
    return newSettings;
  }

  localStorage.setItem("settings", JSON.stringify(newSettings));
  window.dispatchEvent(new Event("settingsUpdated"));
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

export function Quality({
  qualityNumber: initialQualityNumber,
  setQuality: externalSetQuality,
}: {
  qualityNumber?: number;
  setQuality?: (value: number) => void;
}) {
  const getInitialQuality = () => {
    if (typeof window !== "undefined") {
      const settings = JSON.parse(localStorage.getItem("settings") || "[]");
      const qualitySetting = settings.find(
        (setting: any) => "quality" in setting
      );
      return qualitySetting ? qualitySetting.quality : 75;
    }
    return 75;
  };

  const [qualityNumber, setQualityNumber] = useState<number>(getInitialQuality);

  const setQuality = (value: number) => {
    setQualityNumber(value);
    if (externalSetQuality) {
      externalSetQuality(value);
    }
    if (typeof window !== "undefined") {
      const settings = JSON.parse(localStorage.getItem("settings") || "[]");
      const qualityExists = settings.some(
        (setting: any) => "quality" in setting
      );
      let newSettings;
      if (!qualityExists) {
        newSettings = [...settings, { quality: value }];
      } else {
        newSettings = settings.map((setting: { quality: number }) =>
          "quality" in setting ? { quality: value } : setting
        );
      }
      localStorage.setItem("settings", JSON.stringify(newSettings));
    }
  };

  useEffect(() => {
    if (initialQualityNumber) {
      setQuality(initialQualityNumber);
    }
  }, [initialQualityNumber]);

  return (
    <div className="flex items-center flex-col ">
      <label
        htmlFor="quality"
        className="flex justify-center items-center my-1"
      >
        Qualité
        <div className="ml-1">
          <Star />
        </div>
      </label>
      <Slider
        id="quality"
        name="quality"
        min={1}
        max={100}
        step={1}
        value={[qualityNumber]}
        onValueChange={(value: number[]) => setQuality(value[0])}
        className="w-40 my-1"
      />
      <p className={`${qualityColor(qualityNumber)}`}>
        {qualityNumber} - {qualityIndicator(qualityNumber)}
      </p>
    </div>
  );
}
// Read Component
export function Read({
  isVertical: initialIsVertical,
  setIsVertical: externalSetIsVertical,
}: {
  isVertical?: boolean;
  setIsVertical?: (value: boolean) => void;
}) {
  const getInitialReadMode = () => {
    if (typeof window !== "undefined") {
      const settings = JSON.parse(localStorage.getItem("settings") || "[]");
      const readSetting = settings.find((setting: any) => "read" in setting);
      return readSetting ? readSetting.read === "vertical" : false;
    }
    return false;
  };

  const [isVertical, setIsVertical] = useState<boolean>(getInitialReadMode);

  const setReadMode = (value: boolean) => {
    setIsVertical(value);
    if (externalSetIsVertical) {
      externalSetIsVertical(value);
    }
    if (typeof window !== "undefined") {
      const settings = JSON.parse(localStorage.getItem("settings") || "[]");
      const readExists = settings.some((setting: any) => "read" in setting);
      let newSettings;
      if (!readExists) {
        newSettings = [
          ...settings,
          { read: value ? "vertical" : "horizontal" },
        ];
      } else {
        newSettings = settings.map((setting: { read: string }) =>
          "read" in setting
            ? { read: value ? "vertical" : "horizontal" }
            : setting
        );
      }
      localStorage.setItem("settings", JSON.stringify(newSettings));
    }
  };

  useEffect(() => {
    if (initialIsVertical !== undefined) {
      setReadMode(initialIsVertical);
    }
  }, [initialIsVertical]);

  return (
    <div className="flex items-center flex-col ">
      <label htmlFor="read" className="flex items-center justify-center my-1">
        Lecture{" "}
        <div className="ml-1">
          {isVertical ? <GalleryVertical /> : <GalleryHorizontal />}
        </div>
      </label>
      <Select
        name="read"
        value={isVertical ? "vertical" : "horizontal"}
        onValueChange={(value) => setReadMode(value === "vertical")}
      >
        <SelectTrigger className="p-2 mx-2 text-xs hover:shadow-lg hover:opacity-75 transition-opacity ease-in-out duration-300 focus:outline-none cursor-pointer w-auto">
          {isVertical ? "Vertical" : "Horizontal"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vertical">Lecture Vertical</SelectItem>
          <SelectItem value="horizontal">Lecture Horizontal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

interface Settings {
  qualityNumber: number;
  setQuality: (value: number) => void;
  setIsVertical: (value: boolean) => void;
  isVertical: boolean;
}

interface SettingsDialogProps {
  classNames?: string[];
  isOpen?: boolean;
  settings?: Settings;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  classNames,
  isOpen,
  settings,
}) => {
  return (
    <div
      className={`${classNames?.join(" ")} ${
        isOpen ? "" : "opacity-0 pointer-events-none"
      }`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" title="Paramètres">
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-center">
                Paramètres
                <div className="ml-2">
                  <Settings />
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>Modifier vos paramètres</DialogDescription>
          </DialogHeader>
          <Quality
            qualityNumber={settings?.qualityNumber}
            setQuality={settings?.setQuality}
          />
          <Read
            isVertical={settings?.isVertical}
            setIsVertical={settings?.setIsVertical}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
