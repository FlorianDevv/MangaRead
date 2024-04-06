// ResumeReading.tsx
"use client";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "../scrollbar.css";

interface MangaInfo {
  manga: string;
  volume: string;
  page: number;
  totalVolumes: number;
}

interface ResumeReadingProps {
  mangaName?: string;
}

export default function ResumeReading({ mangaName }: ResumeReadingProps) {
  const [state, setState] = useState<MangaInfo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem("mangaInfo");
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      if (mangaName) {
        const filteredState = parsedState.filter(
          (manga: MangaInfo) => manga.manga === mangaName
        );
        setState(filteredState);
      } else {
        setState(parsedState);
      }
    }
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [mangaName]);

  const deleteManga = (index: number) => {
    setState((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      localStorage.setItem("mangaInfo", JSON.stringify(newState));
      return newState;
    });
  };

  const calculateProgress = useMemo(() => {
    return (mangaInfo: MangaInfo) => {
      const currentVolumeNumber = parseInt(
        decodeURIComponent(mangaInfo.volume).split(" ")[1]
      );
      const totalVolumes = mangaInfo.totalVolumes;
      return (currentVolumeNumber / totalVolumes) * 100;
    };
  }, []);

  if (!state.length) {
    return null;
  }

  return (
    <div>
      <h2 className="w-full flex justify-center items-center text-3xl mb-4 mt-6">
        Reprendre la lecture
        <div className="ml-2">
          <BookOpen />
        </div>
      </h2>
      <div className="flex overflow-x-scroll  hover:cursor-default overflow-y-hidden">
        {state.map((mangaInfo, index) => (
          <div
            key={index}
            className="m-2 relative ease-in-out transform group hover:scale-105 transition-transform duration-300"
          >
            <motion.div
              className="flex flex-col items-stretch  bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform  hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: -10 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
            >
              <Link
                key={index}
                href={`/manga/${mangaInfo.manga}/${mangaInfo.volume}/`}
                className="hover:shadow-2xl ease-in-out transform  hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 flex-shrink-0 shine">
                  <Image
                    src={`/${mangaInfo.manga}/Tome 01/01-001.webp`}
                    alt={mangaInfo.manga}
                    quality={1}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="70vw"
                    className="transition-all duration-500 ease-in-out transform"
                  />
                </div>
                <div className="p-2 flex-grow">
                  <p className=" text-sm text-white overflow-wrap  transition-colors duration-300 ease-in-out group-hover:text-red-500 break-words">
                    {decodeURIComponent(mangaInfo.manga)}
                  </p>
                  <div className="text-sm mt-2 text-gray-400 overflow-wrap break-words flex flex-col sm:flex-row">
                    <p>
                      Volume{" "}
                      {decodeURIComponent(mangaInfo.volume).split(" ")[1]}
                    </p>
                    <p className="sm:mx-2 sm:my-0 my-2 hidden sm:block">-</p>
                    <p>Page {mangaInfo.page}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-center">
                    {mangaInfo.totalVolumes !== undefined && (
                      <>
                        <Progress value={calculateProgress(mangaInfo)} />
                        <p className="mt-2 text-gray-200 text-sm">
                          {`${
                            decodeURIComponent(mangaInfo.volume).split(" ")[1]
                          } / ${mangaInfo.totalVolumes}`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteManga(index);
                }}
                className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white hover:text-red-600 bg-black shadow-lg shadow-black outline outline-2 outline-gray-700 rounded transition-all duration-200"
                title="Supprimer de la liste de lecture"
              >
                <X />
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
