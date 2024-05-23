"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import Bookmark from "../components/bookmark";
import ExportImportLocalStorage from "../components/exportImportLocalStorage";
import { MobileNavbarComponent } from "../components/mobilenavbar";
import ResumeReading from "../components/resumereading";
import { Quality, Read } from "../components/settings";
const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

export default function Profile() {
  return (
    <MobileNavbarComponent activePage="Profil">
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
          <ExportImportLocalStorage />
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
