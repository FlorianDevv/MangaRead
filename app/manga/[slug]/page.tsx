// app/manga/[slug]/page.server.tsx
import { ButtonAddBookmark } from "@/app/components/bookmark";
import { MobileNavbarComponent } from "@/app/components/mobilenavbar";
import ResumeReading from "@/app/components/resumereading";
import VolumeSelect from "@/app/components/volumeselect";
import fs from "fs";
import Image from "next/image";
import Link from "next/link";
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
  const decodedSlug = decodeURIComponent(params.slug);
  const mangaDirectory = path.join(process.cwd(), "public", decodedSlug);

  let synopsis: string | undefined;
  const synopsisPath = path.join(mangaDirectory, "resume.json");
  if (fs.existsSync(synopsisPath)) {
    synopsis = JSON.parse(fs.readFileSync(synopsisPath, "utf-8")).synopsis;
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

  const manga: Manga = { synopsis };

  return (
    <MobileNavbarComponent>
      <div className="flex flex-wrap md:flex-nowrap justify-center text-white lg:mx-48 md:mx-24">
        <div className="w-full h-96 relative mt-8">
          <Link href={`/manga/${params.slug}/Tome 01/`}>
            <Image
              src={`/${params.slug}/Tome 01/01-001.webp`}
              alt="Banner"
              style={{ objectFit: "contain" }}
              quality={1}
              fill
              sizes="70vw"
            />
          </Link>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-center text-2xl mt-5">
            {decodeURIComponent(params.slug)}
          </h1>

          {manga.synopsis && ( // Check if synopsis exists before rendering
            <p className="justify-start text-xs sm:text-sm m-2 sm:m-8 px-12 sm:px-1 overflow-wrap-break break-words">
              {manga.synopsis}
            </p>
          )}
        </div>
      </div>
      <ResumeReading mangaName={params.slug} />
      <div className="flex justify-center items-center mb-4">
        <ButtonAddBookmark mangaName={params.slug} />
      </div>
      <h1 className="text-center text-2xl mb-8">
        Total: {volumes.length} volumes
      </h1>

      <VolumeSelect
        volumes={volumes}
        slug={params.slug}
        currentVolume=""
        isPage={false}
      />
    </MobileNavbarComponent>
  );
}
