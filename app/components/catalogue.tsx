"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MangaCardClient from "./mangaCardClient";
const categories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-fi",
];
interface Manga {
  imagePath: string;
  category: string[];
  name: string;
  type: "manga" | "anime" | "both";
  // Add other properties as needed
}
export default function CategorySelector({
  mangaData,
}: {
  mangaData: Array<Manga>;
}) {
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    []
  );
  const [filteredMangaData, setFilteredMangaData] = useState(mangaData);
  const [searchValue, setSearchValue] = useState("");

  const handleCategoryClick = (category: string) => {
    let newSelectedCategories: string[];
    if (selectedCategories.includes(category)) {
      newSelectedCategories = selectedCategories.filter((c) => c !== category);
    } else {
      newSelectedCategories = [...selectedCategories, category];
    }
    setSelectedCategories(newSelectedCategories);

    if (newSelectedCategories.length === 0) {
      setFilteredMangaData(mangaData);
    } else {
      const filtered = mangaData.filter((manga: Manga) =>
        newSelectedCategories.every((cat) => manga.category.includes(cat))
      );
      setFilteredMangaData(filtered);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const displayedMangaData = filteredMangaData.filter((manga) =>
    manga.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center mb-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className={`p-2 m-1 border-2 border-gray-800 rounded-lg ${
              selectedCategories.includes(category)
                ? "bg-gray-800 text-white"
                : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="flex justify-center items-center flex-col">
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearchChange}
          className="p-2 mx-2 rounded-md text-white bg-black border-2 border-[#21496b] border-opacity-75 md:w-72 w-64 transition-all duration-200 ease-in-out focus:outline-none focus:border-sky-600"
        />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2">
          {displayedMangaData.map((manga) => (
            <MangaCardClient
              key={manga.name}
              mangaName={manga.name}
              categories={manga.category}
              type={manga.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
