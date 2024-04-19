import EpisodeSelect from "@/app/components/episodeselect";
import { MobileNavbarComponent } from "@/app/components/mobilenavbar";
import fs from "fs";
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
      path.join(process.cwd(), "public", params.slug, "anime", params.season)
    )
    .map((episodeName: string) => ({ name: episodeName }));

  return (
    <MobileNavbarComponent>
      <div>
        <EpisodeSelect
          episodes={episodes}
          slug={params.slug}
          currentEpisode={params.episode}
          season={params.season}
          isPage={true}
        />
        <Player
          title={params.slug}
          season={params.season}
          episode={params.episode}
        />
      </div>
    </MobileNavbarComponent>
  );
}
