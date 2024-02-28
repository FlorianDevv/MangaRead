// app/manga/[slug]/[volume]/page.tsx
import CheckPage from "@/app/components/checkpage";
import VolumeButton from "@/app/components/volumebutton";
import fs from "fs";
import Link from "next/link";
import path from "path";
import "../../../noscrollbar.css";

type Volume = {
  name: string;
};

export default function Page({
  params,
}: {
  params: { slug: string; volume: string };
}) {
  const mangaDirectory = path.join(process.cwd(), "public", params.slug);
  const volumes: Volume[] = fs.readdirSync(mangaDirectory).map((volume) => {
    return { name: volume };
  });

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-wrap justify-center text-white">
        <h1 className="w-full text-center text-2xl mb-8">
          {params.slug} - {params.volume.replace(/%20/g, " ")}
        </h1>

        {volumes.map((volume, index) => (
          <Link key={index} href={`/manga/${params.slug}/${volume.name}`}>
            <VolumeButton params={params} volume={volume} />
          </Link>
        ))}

        {/* Manga pages */}
      </div>
      <div className="flex justify-center">
        <CheckPage params={params} />
      </div>
    </div>
  );
}
