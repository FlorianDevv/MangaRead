// components/Navbar.tsx
import fs from "fs";
import path from "path";
import LocaleSwitcher from "./LocaleSwitcher";
import NavigationLink from "./navigationLink";
import SearchBar from "./searchbar";

const mangaDirectory = path.join(process.cwd(), "public");
const mangaNames: string[] = JSON.parse(
  fs.readFileSync(path.join(mangaDirectory, "manga.json"), "utf-8")
);

export default function Navbar() {
  return (
    <nav className="bg-black p-2 shadow-md border-b-2 border-sky-600">
      <div className="container mx-auto flex items-center justify-between">
        <NavigationLink href="/">
          <div className="flex items-center text-white hover:text-gray-200 transition-colors duration-200">
            <HomeSvg />
            <span className="ml-2">Home</span>
          </div>
        </NavigationLink>

        <div className="flex flex-warp items-center">
          <SearchBar mangaNames={mangaNames} />
          <LocaleSwitcher />
          <a
            href="https://github.com/FlorianDevv/MangaRead"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white hover:text-gray-200 transition-colors duration-200">
              GitHub
            </p>
          </a>
          {/* <p className="text-white ml-4">Version {process.env.version}</p> */}
        </div>
      </div>
    </nav>
  );
}

function HomeSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}
