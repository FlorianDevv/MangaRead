// app/manga/[slug]/page.server.tsx
import fs from "fs";
import Link from "next/link";
import path from "path";
type Volume = {
  name: string;
  firstImage: string;
};

export default function Page({ params }: { params: { slug: string } }) {
  const mangaDirectory = path.join(process.cwd(), "public", params.slug);
  const volumes: Volume[] = fs.readdirSync(mangaDirectory).map((volume) => {
    const volumeDirectory = path.join(mangaDirectory, volume);
    const images = fs.readdirSync(volumeDirectory);
    const firstImage = images.find((image) => /^(\d+)-001/.test(image)) ?? "";

    return { name: volume, firstImage };
  });

  return (
    <div className="flex flex-wrap justify-center text-white">
      <h1 className="w-full text-center text-2xl mb-8">{params.slug}</h1>
      <h1 className="w-full text-center text-2xl mb-8">Liste des Tomes</h1>
      {volumes.map((volume, index) => (
        <div key={index} className="">
          <Link href={`/manga/${params.slug}/${volume.name}`}>
            <button className="m-2 shadow-md rounded-lg overflow-hidden max-w-sm p-2 text-center bg-gray-700 text-white">
              <h4 className="text-l">{volume.name}</h4>
            </button>
          </Link>
        </div>
      ))}
      <p className="w-full text-center text-2xl mb-8">
        Faut que je mettent une description pour les mangas en plus c&apos;est
        simple mais flemme
      </p>
    </div>
  );
}
