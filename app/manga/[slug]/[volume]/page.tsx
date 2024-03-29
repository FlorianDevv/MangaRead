// app/manga/[slug]/[volume]/page.tsx
import CheckPage from "@/app/components/checkpage";
import VolumeSelect from "@/app/components/volumeselect";
import fs from "fs";
import path from "path";
import "../../../noscrollbar.css";

type Volume = {
  name: string;
  firstImage: string;
  totalPages: number;
};

export default function Page({
  params,
}: {
  params: { slug: string; volume: string };
}) {
  const mangaDirectory = path.join(
    process.cwd(),
    "public",
    decodeURIComponent(params.slug)
  );
  const volumes: Volume[] = fs
    .readdirSync(mangaDirectory)
    .map((volume) => {
      const volumeDirectory = path.join(
        mangaDirectory,
        decodeURIComponent(volume)
      );
      if (
        fs.existsSync(decodeURIComponent(volumeDirectory)) &&
        fs.lstatSync(decodeURIComponent(volumeDirectory)).isDirectory()
      ) {
        const images = fs.readdirSync(decodeURIComponent(volumeDirectory));
        const firstImage =
          images.find((image) => /^(\d+)-001/.test(image)) ?? "01-001.webp";
        const volumeNumber = volume.match(/\d+/)?.[0] || "";
        const totalPages = images.length;
        return { name: volumeNumber, firstImage, totalPages };
      }
    })
    .filter(Boolean) as Volume[];

  const decodedVolume = decodeURIComponent(params.volume);

  const volumeDirectory = path.join(
    process.cwd(),
    "public",
    params.slug,
    decodedVolume
  );
  const images = fs.readdirSync(decodeURIComponent(volumeDirectory));
  const totalPages = images.length;

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-wrap justify-center text-white">
        <h1 className="w-full text-center text-2xl mb-8">
          {decodeURIComponent(params.slug)} - {decodedVolume}
        </h1>

        <VolumeSelect
          volumes={volumes}
          slug={params.slug}
          currentVolume={decodedVolume}
          isPage={true}
        />
      </div>
      <div className="flex justify-center">
        <CheckPage params={params} totalPages={totalPages} />
      </div>
    </div>
  );
}
