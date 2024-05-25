import { MobileNavbarComponent } from "@/app/components/mobilenavbar";
import EpisodeSelect from "@/app/components/select/episodeselect";
import { SeasonSelect } from "@/app/components/select/seasonselect";
import fs from "fs";
import path from "path";
import React, { Suspense } from "react";
export default function Page({
  params,
}: {
  params: { slug: string; season: string; episode: string };
}) {
  const animePath = path.join(
    process.cwd(),
    "public",
    decodeURIComponent(params.slug),
    "anime"
  );
  const seasonPath = path.join(animePath, params.season);

  //use fs to get the list of episodes
  const episodes =
    fs.existsSync(seasonPath) && fs.lstatSync(seasonPath).isDirectory()
      ? fs
          .readdirSync(seasonPath)
          .filter((episodeName: string) => !episodeName.startsWith("."))
          .map((episodeName: string) => ({ name: episodeName }))
      : [];

  const seasons =
    fs.existsSync(animePath) && fs.lstatSync(animePath).isDirectory()
      ? fs
          .readdirSync(animePath)
          .filter((seasonName: string) => {
            const seasonPath = path.join(animePath, seasonName);
            return (
              !seasonName.startsWith(".") &&
              fs.lstatSync(seasonPath).isDirectory()
            );
          })
          .map((seasonName: string) => ({ name: seasonName }))
      : [];
  if (episodes.length === 0 || seasons.length === 0) {
    return (
      <div>
        <h1>Error 404</h1>
      </div>
    );
  }

  const Player = React.lazy(() => import("../../../../components/player"));

  // ...

  return (
    <MobileNavbarComponent>
      <div className="flex flex-col items-center ">
        <h1 className="text-center text-3xl my-4">
          {decodeURIComponent(params.slug)}
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
        <Suspense fallback={<div>...</div>}>
          <Player
            title={params.slug}
            season={params.season}
            episode={params.episode}
            episodes={episodes}
            seasons={seasons}
          />
        </Suspense>
      </div>
    </MobileNavbarComponent>
  );
}
