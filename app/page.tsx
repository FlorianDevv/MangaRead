import fs from "fs";
import Link from "next/link";
import path from "path";
import DynamicBlur from "./components/dynamicBlur";
import ResumeReading from "./components/resumereading";
import "./scrollbar.css";

export default function Home() {
  const mangaDirectory = path.join(process.cwd(), "public");
  const mangaNames = fs.readdirSync(mangaDirectory).filter((name) => {
    const itemPath = path.join(mangaDirectory, name);
    return fs.lstatSync(itemPath).isDirectory();
  });

  // Write the mangaNames array to a JSON file
  fs.writeFileSync(
    path.join(mangaDirectory, "manga.json"),
    JSON.stringify(mangaNames)
  );

  return (
    <div className="text-white">
      <ResumeReading />
      <hr className="my-8" />
      <h2 className="text-center text-3xl mb-4">Tous les Mangas disponible</h2>
      <div className="mx-4">
        <div className="flex overflow-x-scroll whitespace-nowrap">
          {mangaNames.map((mangaName) => (
            <Link key={mangaName} href={`/manga/${mangaName}`}>
              <div className="flex flex-col m-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:opacity-80">
                <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64">
                  <DynamicBlur
                    src={`/${mangaName}/Tome 01/01-001.webp`}
                    alt={mangaName}
                  />
                </div>
                <div className="p-2">
                  <h4 className="text-sm text-center text-white">
                    {mangaName}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
