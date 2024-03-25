"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
interface SearchBarProps {
  mangaNames: string[];
}

export default function SearchBar({ mangaNames }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);

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
    <>
      <div className="flex items-center justify-center flex-col">
        <input
          type="text"
          placeholder="Search"
          className="p-2 mx-2 rounded-md text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="absolute bg-white w-full mt-36 z-10">
        {search !== "" &&
          results.map((result) => (
            <Link key={result} href={`/manga/${result}`}>
              <p
                className="block p-4 m-2 bg-gray-200 rounded-md text-lg hover:bg-gray-300"
                onClick={resetSearch}
              >
                {result}
              </p>
            </Link>
          ))}
      </div>
    </>
  );
}
