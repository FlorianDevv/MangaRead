// app/manga/[slug]/page.server.tsx
import AnimeEpisode from "@/app/components/animeEpisode";
import { ButtonAddBookmark } from "@/app/components/bookmark";
import { AnimeProgress, MangaProgress } from "@/app/components/resumereading";
import VolumeSelect from "@/app/components/select/volumeselect";
import { ItemDetails, getDetails } from "@/app/types/getDetails";
import Image from "next/image";

export default async function Info({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const itemDetails: ItemDetails | ItemDetails[] = await getDetails(
    decodedSlug
  );

  // Ensure itemDetails is not an array
  if (Array.isArray(itemDetails)) {
    throw new Error("Expected itemDetails to be an object, but got an array");
  }

  const { synopsis, categories = [], volumes, types, seasons } = itemDetails;

  const isMangaDirectoryExists = types.includes("manga");
  const isAnimeDirectoryExists = types.includes("anime");

  // Convert volumes and seasons to the expected types
  const volumesWithType = (volumes ?? []).map((volume) => ({ name: volume }));
  const seasonsWithType = (seasons ?? []).map((season) => ({
    name: `Season ${season.season}`,
  }));

  // Convert seasons to the expected format for AnimeEpisode
  const episodesWithType = (seasons ?? []).flatMap((season) =>
    season.episodes.map((episode) => ({
      name: `Episode ${episode}`,
      seasonNumber: `Season ${season.season}`,
      episodeNumber: episode.toString(),
    }))
  );

  return (
    <div className="overflow-auto h-screen relative">
      <div className="relative top-0 w-full h-96 ">
        {!isAnimeDirectoryExists ? (
          <Image
            src={`/api/image?path=${params.slug}/manga/Tome 01/01-001.webp`}
            alt={`${params.slug}`}
            quality={50}
            fill
            priority={true}
            className="object-cover"
          />
        ) : (
          <Image
            src={`/api/image?path=${params.slug}/anime/thumbnail.webp`}
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
        <ButtonAddBookmark itemName={params.slug} types={types} />
        {isAnimeDirectoryExists && <AnimeProgress Name={params.slug} />}
        <div className="flex flex-wrap lg:flex-nowrap justify-center">
          <div className="flex flex-col items-center justify-center md:items-start md:justify-start ">
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start mb-4">
                {categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-gray-900 text-white text-xs sm:text-sm rounded-full px-2 py-1 m-1">
                    {category}
                  </span>
                ))}
              </div>
            )}
            {synopsis && (
              <p className="text-xs sm:text-sm overflow-wrap-break break-words w-5/6 text-left lg:text-justify lg:mr-4 mb-2">
                {synopsis}
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
                    volumes={volumesWithType.map((volume) => ({
                      name: volume.name.name,
                      totalPages: volume.name.totalPages,
                      type: volume.name.type,
                    }))}
                    slug={params.slug}
                    currentVolume=""
                    isPage={false}
                  />
                </div>
              )}
              {isAnimeDirectoryExists && (
                <AnimeEpisode
                  seasons={seasonsWithType}
                  episodes={episodesWithType}
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
