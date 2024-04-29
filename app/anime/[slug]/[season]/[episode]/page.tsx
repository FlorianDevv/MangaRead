import { MobileNavbarComponent } from "@/app/components/mobilenavbar";
import EpisodeSelect from "@/app/components/select/episodeselect";
import { SeasonSelect } from "@/app/components/select/seasonselect";
import fs from "fs";
import Link from "next/link";
import path from "path";
import Player from "../../../../components/player";
export default function Page({
  params,
}: {
  params: { slug: string; season: string; episode: string };
}) {
  //use fs to get the list of episodes
  const episodes = fs
    .readdirSync(
      path.join(
        process.cwd(),
        "public",
        decodeURIComponent(params.slug),
        "anime",
        params.season
      )
    )
    .filter((episodeName: string) => !episodeName.startsWith("."))
    .map((episodeName: string) => ({ name: episodeName }));

  const seasons = fs
    .readdirSync(
      path.join(
        process.cwd(),
        "public",
        decodeURIComponent(params.slug),
        "anime"
      )
    )
    .filter((seasonName: string) => !seasonName.startsWith("."))
    .map((seasonName: string) => ({ name: seasonName }));

  if (episodes.length === 0 || seasons.length === 0) {
    return (
      <div>
        <h1>Error 404</h1>
      </div>
    );
  }

  return (
    <MobileNavbarComponent>
      <div className="flex flex-col items-center ">
        <h1 className="text-center text-3xl my-4 hover:text-red-500 ease-in-out transform transition-colors duration-300">
          <Link href={`/manga/${decodeURIComponent(params.slug)}`}>
            {decodeURIComponent(params.slug)}
          </Link>
        </h1>
        <div className="flex flex-wrap items-center">
          <EpisodeSelect
            episodes={episodes}
            slug={params.slug}
            currentEpisode={params.episode}
            season={params.season}
            isPage={true}
          />
          <SeasonSelect
            seasons={seasons}
            slug={params.slug}
            currentSeason={params.season}
            isPage={true}
          />
        </div>
        <Player
          title={params.slug}
          season={params.season}
          episode={params.episode}
          episodes={episodes}
          seasons={seasons}
        />
      </div>
    </MobileNavbarComponent>
  );
}
