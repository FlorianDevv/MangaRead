// app/manga/[slug]/page.server.tsx
import { ButtonAddBookmark } from "@/app/components/bookmark";
import { MobileNavbarComponent } from "@/app/components/mobilenavbar";
import ResumeReading from "@/app/components/resumereading";
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
      <h1 className="text-center items-center justify-center text-2xl lg:text-4xl mt-5 mb:mb-3">
        {decodeURIComponent(params.slug)}
      </h1>
      <div className="flex flex-wrap lg:flex-nowrap justify-center text-white ">
        <div className="w-80  my-8 items-center justify-center flex flex-col space-y-4">
          <Image
            src={`/${params.slug}/Tome 01/01-001.webp`}
            alt={`${params.slug}`}
            quality={1}
            width={500}
            height={300}
            layout="responsive"
            // className="object-contain"
            sizes="70vw"
          />
          <ButtonAddBookmark mangaName={params.slug} />
        </div>

        <div className="w-full lg:w-1/2 lg:flex lg:flex-row justify-center items-center text-center lg:ml-8 space-y-6 lg:space-y-0 mx-4">
          <div className="flex flex-col items-center justify-center md:items-start md:justify-start">
            <h1 className="text-2xl my-4">Total: {volumes.length} volumes</h1>

            {manga.synopsis && ( // Check if synopsis exists before rendering
              <p className="text-xs sm:text-sm overflow-wrap-break break-words text-left lg:text-justify lg:mr-4 mb-4">
                {manga.synopsis}
              </p>
            )}
            <VolumeSelect
              volumes={volumes}
              slug={params.slug}
              currentVolume=""
              isPage={false}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center ml-4 md:mr-28 md:ml-56">
        <ResumeReading mangaName={params.slug} />
      </div>
    </MobileNavbarComponent>
  );
}
