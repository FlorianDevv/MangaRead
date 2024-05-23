// app/manga/[slug]/page.server.tsx
import AnimeEpisode from "@/app/components/animeEpisode";
import { MobileNavbarComponent } from "@/app/components/mobilenavbar";
import { AnimeProgress, MangaProgress } from "@/app/components/resumereading";
import VolumeSelect from "@/app/components/select/volumeselect";
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

type Season = {
  name: string;
};

type Episode = {
  name: string;
  seasonNumber: string;
  episodeNumber: string;
};

export default function Info({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const mangaDirectory = path.join(
    process.cwd(),
    "public",
    decodedSlug,
    "manga"
  );
  const animeDirectory = path.join(
    process.cwd(),
    "public",
    decodedSlug,
    "anime"
  );

  let synopsis: string | undefined;
  const synopsisPath = path.join(
    process.cwd(),
    "public",
    decodedSlug,
    "resume.json"
  );
  if (fs.existsSync(synopsisPath)) {
    const data = JSON.parse(fs.readFileSync(synopsisPath, "utf-8"));
    synopsis = data.synopsis ?? null;
  }
  let categories: string[] = [];
  const categoriesPath = path.join(
    process.cwd(),
    "public",
    decodedSlug,
    "resume.json"
  );
  if (fs.existsSync(categoriesPath)) {
    const data = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
    categories = data.categories ?? [];
  }

  let volumes: Volume[] = [];
  if (fs.existsSync(decodeURIComponent(mangaDirectory))) {
    volumes = fs
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
  }

  const manga: Manga = { synopsis };
  const isMangaDirectoryExists = fs.existsSync(mangaDirectory);
  const isAnimeDirectoryExists = fs.existsSync(animeDirectory);

  const seasons: Season[] =
    isAnimeDirectoryExists && fs.lstatSync(animeDirectory).isDirectory()
      ? fs
          .readdirSync(animeDirectory)
          .filter((season) =>
            fs.lstatSync(path.join(animeDirectory, season)).isDirectory()
          )
          .map((season) => ({ name: season }))
      : [];

  const episodes: Episode[] = isAnimeDirectoryExists
    ? seasons.flatMap((season) => {
        const seasonDirectory = path.join(animeDirectory, season.name);
        const episodeFiles = fs.lstatSync(seasonDirectory).isDirectory()
          ? fs.readdirSync(seasonDirectory)
          : [];
        return episodeFiles
          .filter((episodeFile) => path.extname(episodeFile) === ".mp4")
          .map((episodeFile) => {
            const episodeName = episodeFile.split(".")[0];
            const [seasonNumber, episodeNumber] = episodeName.split("-");
            return { name: episodeFile, seasonNumber, episodeNumber };
          });
      })
    : [];

  return (
    <div className="overflow-auto h-screen relative">
      <div className="relative top-0 w-full h-96 ">
        {!isAnimeDirectoryExists ? (
          <Image
            src={`/${params.slug}/manga/Tome 01/01-001.webp`}
            alt={`${params.slug}`}
            quality={50}
            fill
            priority={true}
            className="object-cover"
          />
        ) : (
          <Image
            src={`/${params.slug}/anime/thumbnail.webp`}
            alt={`${params.slug}`}
            quality={50}
            fill
            priority={true}
            className="object-cover"
          />
        )}
      </div>
      <div className="w-full h-24 bg-gradient-to-t from-black to-transparent absolute top-56"></div>
      <div className="relative bg-black transform -translate-y-16 px-8">
        <h1 className="text-xl lg:text-3xl z-50 transform -translate-y-8">
          {decodeURIComponent(params.slug)}
        </h1>
        {isAnimeDirectoryExists && <AnimeProgress Name={params.slug} />}
        <div className="flex flex-wrap lg:flex-nowrap justify-center">
          <div className="flex flex-col items-center justify-center md:items-start md:justify-start ">
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start mb-4">
                {categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-gray-900 text-white text-xs sm:text-sm rounded-full px-2 py-1 m-1"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            {manga.synopsis && (
              <p className="text-xs sm:text-sm overflow-wrap-break break-words w-5/6 text-left lg:text-justify lg:mr-4 mb-2">
                {manga.synopsis}
              </p>
            )}
            <div className="flex flex-col">
              {isMangaDirectoryExists && (
                <div className="p-2 rounded-md flex flex-col justify-start items-start">
                  <h1 className="p-4 bg-blue-900 text-lg py-1 rounded inline-block m-2">
                    Manga
                  </h1>
                  <MangaProgress Name={params.slug} />
                  <VolumeSelect
                    volumes={volumes}
                    slug={params.slug}
                    currentVolume=""
                    isPage={false}
                  />
                </div>
              )}
              {isAnimeDirectoryExists && (
                <AnimeEpisode
                  seasons={seasons}
                  episodes={episodes}
                  slug={params.slug}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
