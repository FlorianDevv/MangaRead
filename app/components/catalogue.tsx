"use client";
import { useState } from "react";
import MangaCardClient from "./mangaCardClient";

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
  const [selectedTypes, setSelectedTypes] = useState<Array<string>>([]);
  const categories = Array.from(
    new Set(mangaData.flatMap((manga) => manga.category))
  );
  const types = Array.from(
    new Set(
      mangaData.flatMap((manga) =>
        manga.type === "both" ? ["manga", "anime"] : [manga.type]
      )
    )
  );

  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    []
  );
  const [filteredMangaData, setFilteredMangaData] = useState(mangaData);
  const [searchValue, setSearchValue] = useState("");

  const handleTypeClick = (type: string) => {
    let newSelectedTypes: string[];
    if (selectedTypes.includes(type)) {
      newSelectedTypes = selectedTypes.filter((t) => t !== type);
    } else {
      newSelectedTypes = [...selectedTypes, type];
    }
    setSelectedTypes(newSelectedTypes);

    if (newSelectedTypes.length === 0) {
      setFilteredMangaData(mangaData);
    } else {
      const filtered = mangaData.filter(
        (manga: Manga) =>
          newSelectedTypes.includes(manga.type) || manga.type === "both"
      );
      setFilteredMangaData(filtered);
    }
  };
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
      <div className="flex flex-col justify-center mb-4">
        <div className="flex flex-row justify-center items-center">
          {types.map((type) => (
            <label key={type} className="inline-flex items-center m-1 text-lg">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 "
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeClick(type)}
              />
              <span className="ml-2 uppercase">{type}</span>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap justify-center mt-4">
          {categories.map((category) => (
            <label key={category} className="inline-flex items-center m-1">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryClick(category)}
              />
              <span className="ml-2 ">{category}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center flex-col">
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearchChange}
          className="p-2 mx-2 rounded-md text-white bg-black border-2 border-[#21496b] border-opacity-75 md:w-72 w-64 transition-all duration-200 ease-in-out focus:outline-none focus:border-sky-600"
        />
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mx-2">
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
