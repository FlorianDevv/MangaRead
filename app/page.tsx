import fs from "fs";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import ResumeReading from "./components/resumereading";
import "./scrollbar.css";

export default function Home() {
  const mangaDirectory = path.join(process.cwd(), "public");
  const mangaNames = fs.readdirSync(mangaDirectory).filter((name) => {
    const itemPath = path.join(mangaDirectory, name);
    return fs.lstatSync(itemPath).isDirectory();
  });

  return (
    <div className="text-white">
      <div className="flex flex-wrap justify-center items-center ">
        <h2 className="w-full text-center text-3xl mb-4 mt-6">
          Reprendre la lecture
        </h2>
        <ResumeReading />
      </div>
      <hr className="my-8" />
      <h2 className="text-center text-3xl mb-4">Tous les Mangas disponible</h2>
      <div className="flex flex-nowrap justify-center items-center overflow-x-auto mx-8">
        {mangaNames.map((mangaName) => (
          <Link key={mangaName} href={`/manga/${mangaName}`}>
            <div className="flex flex-col items-stretch m-2 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:opacity-80">
              <div className="relative h-32 sm:h-48 md:h-64  w-32 sm:w-48 md:w-64 flex-shrink-0">
                <Image
                  src={`/${mangaName}/Tome 01/01-001.webp`}
                  alt={mangaName}
                  layout="fill"
                  objectFit="cover"
                  fill
                  quality={80}
                  className="transition-all duration-500 ease-in-out transform "
                />
              </div>
              <div className="p-2 flex-grow">
                <h4 className="text-sm text-center text-white">{mangaName}</h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
