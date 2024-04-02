// app/manga/[slug]/page.server.tsx
import { MobileNavbarComponent } from "@/app/components/mobilenavbar";
import VolumeSelect from "@/app/components/volumeselect";
import fs from "fs";
import Image from "next/image";
import path from "path";

type Volume = {
  name: string;
  firstImage: string;
};

type Manga = {
  synopsis?: string;
  banner?: string;
};

export default function Page({ params }: { params: { slug: string } }) {
  const mangaDirectory = path.join(process.cwd(), "public", params.slug);

  let synopsis: string | undefined;
  const synopsisPath = path.join(mangaDirectory, "resume.json");
  if (fs.existsSync(synopsisPath)) {
    synopsis = JSON.parse(fs.readFileSync(synopsisPath, "utf-8")).synopsis;
  }

  let banner: string | undefined;
  const bannerPath = path.join(mangaDirectory, "banner.webp");
  if (fs.existsSync(bannerPath)) {
    banner = bannerPath;
  }
  const volumes: Volume[] = fs
    .readdirSync(decodeURIComponent(mangaDirectory))
    .map((volume) => {
      const volumeDirectory = path.join(mangaDirectory, volume);
      if (
        fs.existsSync(decodeURIComponent(volumeDirectory)) &&
        fs.lstatSync(decodeURIComponent(volumeDirectory)).isDirectory()
      ) {
        const images = fs.readdirSync(decodeURIComponent(volumeDirectory));
        const firstImage =
          images.find((image) => /^(\d+)-001/.test(image)) ?? "01-001.webp";
        return { name: volume, firstImage };
      }
    })
    .filter(Boolean) as Volume[];

  const manga: Manga = { synopsis, banner };

  return (
    <MobileNavbarComponent activePage="Home">
      <div className="flex flex-wrap justify-center text-white">
        <h1 className="w-full text-center text-2xl my-5">
          {decodeURIComponent(params.slug)}
        </h1>
        {banner && ( // Check if banner file exists before rendering
          <div className="w-full h-52 relative mx-20">
            <Image
              src={`/${params.slug}/banner.webp`}
              alt="Banner"
              style={{ objectFit: "cover" }}
              quality={25}
              fill
              sizes="90vw"
            />
          </div>
        )}
        {manga.synopsis && ( // Check if synopsis exists before rendering
          <p className="w-full justify-start text-sm m-8 px-12 overflow-wrap-break break-words">
            {manga.synopsis}
          </p>
        )}
        <h1 className="w-full text-center text-2xl mb-8">
          total: {volumes.length} volumes
        </h1>
        <VolumeSelect
          volumes={volumes}
          slug={params.slug}
          currentVolume=""
          isPage={false}
        />
      </div>
    </MobileNavbarComponent>
  );
}
