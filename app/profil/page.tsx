"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import Bookmark from "../components/bookmark";
import { MobileNavbarComponent } from "../components/mobilenavbar";
import Player from "../components/player";
import ResumeReading from "../components/resumereading";
import { Quality, Read } from "../components/settings";
const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);
interface Anime {
  title: string;
  episodes: number;
  season: number;
}
export default function Profile() {
  const [anime, setAnime] = useState({ title: "", episodes: 0, season: 0 });

  useEffect(() => {
    const animeInfo = JSON.parse(localStorage.getItem("animeInfo") || "{}");
    setAnime({
      title: animeInfo.anime,
      episodes: animeInfo.episode,
      season: animeInfo.season,
    });
  }, []);

  return (
    <MobileNavbarComponent activePage="Profil">
      <div className="flex justify-center items-center  mb-4 mt-8 ">
        <Player {...anime} />
      </div>
      <div className="lg:mx-48 md:mx-24">
        <ResumeReading />
        <hr className="my-8" />
        <Bookmark />
        <hr className="my-8" />
        <div className="flex justify-center items-center  mb-4 mt-8">
          <Card className="w-64">
            <CardHeader className="items-center justify-center flex">
              <CardTitle className="flex flex-row">
                {data.profil.settings} <Settings />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 items-center">
              <Quality />
              <Read />
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
