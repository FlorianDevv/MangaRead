// ResumeReading.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../scrollbar.css";

export default function ResumeReading() {
  const [state, setState] = useState<
    Array<{
      manga: string;
      volume: string;
      page: number;
    }>
  >([]);

  useEffect(() => {
    const storedState = localStorage.getItem("mangaInfo");
    if (storedState) {
      setState(JSON.parse(storedState));
    }
  }, []);

  const deleteManga = (index: number) => {
    const newState = [...state];
    newState.splice(index, 1);
    setState(newState);
    localStorage.setItem("mangaInfo", JSON.stringify(newState));
  };

  if (!state.length) {
    return null;
  }

  return (
    <div>
      <h2 className="w-full text-center text-3xl mb-4 mt-6">
        Reprendre la lecture
      </h2>
      <div className="flex overflow-x-scroll whitespace-nowrap hover:cursor-default">
        {state.map((mangaInfo, index) => (
          <div
            key={index}
            className="m-2 relative ease-in-out transform hover:opacity-75 hover:scale-105 transition-transform duration-300"
          >
            <motion.div
              className="flex flex-col items-stretch  bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform hover:opacity-75 hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Link
                key={index}
                href={`/manga/${mangaInfo.manga}/${mangaInfo.volume}/`}
                className="hover:shadow-2xl ease-in-out transform hover:opacity-75 hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64 flex-shrink-0">
                  <Image
                    src={`/${mangaInfo.manga}/Tome 01/01-001.webp`}
                    alt={mangaInfo.manga}
                    quality={1}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="70vw"
                    className="transition-all duration-500 ease-in-out transform 5  "
                  />
                </div>
                <div className="p-2 flex-grow">
                  <p className="text-sm text-center text-white">
                    {decodeURIComponent(mangaInfo.manga)} <br></br> Volume{" "}
                    {decodeURIComponent(mangaInfo.volume).split(" ")[1]}{" "}
                    <br></br> Page {mangaInfo.page}
                  </p>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteManga(index);
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                title="Supprimer de la liste de lecture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6 text-white hover:text-red-900 bg-black shadow-lg shadow-black outline outline-2 outline-gray-700 rounded transition-all duration-200"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                </svg>
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
