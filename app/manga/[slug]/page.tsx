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
      <h1 className="text-center items-center justify-center text-4xl mt-5 mb:mb-3">
        {decodeURIComponent(params.slug)}
      </h1>
      <div className="flex flex-wrap md:flex-nowrap justify-center text-white ">
        <Link href={`/manga/${params.slug}/Tome 01/`}>
          <div className="w-full h-full relative my-8">
            <Image
              src={`/${params.slug}/Tome 01/01-001.webp`}
              alt={`${params.slug}`}
              // style={{ objectFit: "cover" }}
              quality={1}
              width={400}
              height={900}
              sizes="70vw"
            />
          </div>
        </Link>

        <div className="w-full md:w-1/2 md:flex md:flex-row justify-center items-center text-center md:ml-8 space-y-6 md:space-y-0 mx-4">
          {manga.synopsis && ( // Check if synopsis exists before rendering
            <p className="text-xs sm:text-sm overflow-wrap-break break-words text-left md:text-justify md:mr-4">
              {manga.synopsis}
            </p>
          )}

          <div className="md:flex md:flex-col md:justify-center md:items-center">
            <ButtonAddBookmark mangaName={params.slug} />

            <h1 className="text-2xl my-4">Total: {volumes.length} volumes</h1>
            <VolumeSelect
              volumes={volumes}
              slug={params.slug}
              currentVolume=""
              isPage={false}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center text-center md:mr-28 md:ml-56">
        <ResumeReading mangaName={params.slug} />
      </div>
    </MobileNavbarComponent>
  );
}
