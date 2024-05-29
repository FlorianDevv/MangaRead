// app/manga/[slug]/[volume]/page.tsx
import CheckPage from "@/app/components/checkpage";
import VolumeSelect from "@/app/components/select/volumeselect";
import "@/app/mangapage.css";
import fs from "fs";
import path from "path";

type Volume = {
  name: string;
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
    decodeURIComponent(params.slug),
    "manga"
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
        const volumeNumber = volume.match(/\d+/)?.[0] || "";
        const totalPages = images.length;
        return { name: volumeNumber, totalPages };
      }
    })
    .filter(Boolean) as Volume[];

  const decodedVolume = decodeURIComponent(params.volume);

  const volumeDirectory = path.join(
    process.cwd(),
    "public",
    params.slug,
    "manga",
    decodedVolume
  );
  const images = fs.readdirSync(decodeURIComponent(volumeDirectory));
  const totalPages = images.length;

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-wrap justify-center ">
        <h1 className="w-full text-center text-3xl my-4">
          {decodeURIComponent(params.slug)}
        </h1>

        <VolumeSelect
          volumes={volumes}
          slug={params.slug}
          currentVolume={decodedVolume}
          isPage={true}
        />
      </div>
      <div className="flex justify-center">
        <CheckPage params={params} totalPages={totalPages} volumes={volumes} />
      </div>
    </div>
  );
}
