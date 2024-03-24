// app/manga/[slug]/page.server.tsx
import VolumeSelect from "@/app/components/volumeselect";
import fs from "fs";

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
    const firstImage =
      images.find((image) => /^(\d+)-001/.test(image)) ?? "01-001.webp";
    return { name: volume, firstImage };
  });
  return (
    <div className="flex flex-wrap justify-center text-white">
      <h1 className="w-full text-center text-2xl mb-8">{params.slug}</h1>
      <h1 className="w-full text-center text-2xl mb-8">Liste des Tomes</h1>
      <VolumeSelect
        volumes={volumes}
        slug={params.slug}
        currentVolume=""
        isPage={false}
      />
      <p className="w-full text-center text-2xl mb-8">
        number of volumes: {volumes.length}
      </p>
    </div>
  );
}
