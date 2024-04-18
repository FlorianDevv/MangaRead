"use client";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
interface SearchBarProps {
  mangaNames: string[];
}

export default function SearchBar({ mangaNames }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);

  // Update search results when search changes
  useEffect(() => {
    if (search !== "") {
      const searchResults = mangaNames
        .filter((name: string) =>
          name.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 4);

      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [search, mangaNames]);

  const resetSearch = () => {
    setSearch("");
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center flex-col lg:mr-8 ">
        <input
          name={data.search.title}
          type="search"
          placeholder={data.search.title}
          className="p-2 mx-2 rounded-md text-white bg-black border-2 border-[#21496b] border-opacity-75 md:w-72 w-64 transition-all duration-200 ease-in-out focus:outline-none focus:border-sky-600 "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div
        className={`absolute w-full mt-2 z-10 bg-black bg-opacity-90 h-auto z-99 rounded shadow-lg shadow-black border-1 border-white border-opacity-50`}
      >
        {search !== "" &&
          results.map((result) => (
            <div key={result}>
              <Link href={`/manga/${result}`}>
                <div
                  className="group flex items-center rounded border-t-2 border-sky-600 hover:bg-gray-700 text-white hover:text-sky-500 pt-1 pl-1 w-full transition-all duration-200 font-bold cursor-pointer"
                  onClick={resetSearch}
                >
                  <div className="transition-all duration-200 transform group-hover:opacity-50 group-hover:scale-110">
                    <Image
                      src={`/${result}/Tome 01/01-001.webp`}
                      alt={result}
                      width={60}
                      height={60}
                      quality={1}
                    />
                  </div>
                  <p className="ml-2">{result}</p>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
