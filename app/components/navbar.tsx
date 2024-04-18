// components/Navbar.tsx
import fs from "fs";
import { CircleUser, Github, Home } from "lucide-react";
import Link from "next/link";
import path from "path";
import { MobileNavbarComponent } from "./mobilenavbar";
import SearchBar from "./searchbar";
const mangaDirectory = path.join(process.cwd(), "public");
const mangaNames: string[] = JSON.parse(
  fs.readFileSync(path.join(mangaDirectory, "manga.json"), "utf-8")
);
const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);
export default function Navbar() {
  return (
    <nav className="bg-black p-2 shadow-md border-b-2 border-sky-600 md:block hidden">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center text-white hover:opacity-75 duration-200 ease-in-out transition-opacity mr-4 lg:mr-8"
          >
            <Home />
            <span className="ml-2">{data.navbar.home}</span>
          </Link>
          <Link
            href="/profil"
            className="flex items-center text-white hover:opacity-75 duration-200 ease-in-out transition-opacity"
          >
            <CircleUser />
            <span className="ml-2">{data.navbar.profil}</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <SearchBar mangaNames={mangaNames} />
          <a
            href="https://github.com/FlorianDevv/MangaRead"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="md:block hidden"
          >
            <p className="text-white hover:opacity-75 duration-200 ease-in-out transition-opacity md:block hidden ">
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
