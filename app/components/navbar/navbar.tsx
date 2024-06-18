// components/Navbar.tsx
import { getDetails } from "@/app/types/getDetails";
import { CircleUser, Github, Home, LibraryBig, Tv } from "lucide-react";
import Link from "next/link";
import SearchBar from "../searchbar";
import { MobileNavbarComponent } from "./mobilenavbar";

async function fetchAllItems() {
  try {
    const itemsDetails = await getDetails();
    const transformedData = (
      Array.isArray(itemsDetails) ? itemsDetails : [itemsDetails]
    ).map((item) => {
      let imagePath = "";
      if (item.types.includes("manga")) {
        imagePath = `/api/image?path=${item.name}/manga/Tome 01/01-001.webp`;
      } else if (item.types.includes("anime")) {
        imagePath = `/api/image?path=${item.name}/anime/thumbnail.webp`;
      }
      return { name: item.name, imagePath };
    });
    return transformedData;
  } catch (error) {
    return [];
  }
}

const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);
export default async function Navbar() {
  let details = await fetchAllItems();
  return (
    <nav className="bg-black p-2 shadow-md border-b-2 border-sky-600 md:block hidden">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex hover:opacity-75 duration-200 ease-in-out transition-opacity mr-4 lg:mr-8"
          >
            <Home />
            <span className="ml-2">{data.navbar.home}</span>
          </Link>
          <Link
            href="/profil"
            className="flex hover:opacity-75 duration-200 ease-in-out transition-opacity mr-4 lg:mr-8"
          >
            <CircleUser />
            <span className="ml-2">{data.navbar.profil}</span>
          </Link>
          <Link
            href="/live"
            className="flex hover:opacity-75 duration-200 ease-in-out transition-opacity"
          >
            <Tv />
            <span className="ml-2">Live</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/search"
            className="hover:opacity-75 duration-200 ease-in-out transition-opacity flex"
          >
            <LibraryBig />
            <span className="ml-2"> {data.navbar.catalog}</span>
          </Link>
          <SearchBar mangaData={details} />
          <a
            href="https://github.com/FlorianDevv/MangaRead"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <p className="hover:opacity-75 duration-200 ease-in-out transition-opacity">
              <Github />
            </p>
          </a>
        </div>
      </div>
    </nav>
  );
}

export function MobileNavbar() {
  return <MobileNavbarComponent />;
}
