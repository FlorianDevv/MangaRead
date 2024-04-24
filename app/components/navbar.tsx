// components/Navbar.tsx
import fs from "fs";
import { CircleUser, Github, Home, LibraryBig } from "lucide-react";
import Link from "next/link";
import path from "path";
import { MobileNavbarComponent } from "./mobilenavbar";
import SearchBar from "./searchbar";

const publicDirectory = path.join(process.cwd(), "public");

let mangaData: { name: string; imagePath: string }[] = [];
try {
  const directoryItems = fs.readdirSync(publicDirectory, {
    withFileTypes: true,
  });
  mangaData = directoryItems
    .filter((item) => item.isDirectory() && item.name !== "icons") // keep only directories and remove 'icons'
    .map((item) => {
      const mangaPath = `/${item.name}/manga/Tome 01/01-001.webp`;
      const animePath = `/${item.name}/anime/Season01/01-001.webp`;
      const imagePath = fs.existsSync(path.join(publicDirectory, mangaPath))
        ? mangaPath
        : animePath;
      return { name: item.name, imagePath };
    });
} catch (error) {
  console.error(`Failed to read public directory: ${error}`);
}

const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);
export default function Navbar() {
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
            className="flex hover:opacity-75 duration-200 ease-in-out transition-opacity"
          >
            <CircleUser />
            <span className="ml-2">{data.navbar.profil}</span>
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
          <SearchBar mangaData={mangaData} />
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
