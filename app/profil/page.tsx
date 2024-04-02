"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileNavbarComponent } from "../components/mobilenavbar";
import ResumeReading from "../components/resumereading";
import { Quality, Read } from "../components/settings";

export default function Profile() {
  return (
    <MobileNavbarComponent activePage="Profil">
      <div>
        <ResumeReading />
        <Card className="w-64 ">
          <CardHeader className="items-center justify-center flex">
            <CardTitle>Paramètres ⚙️</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 items-center">
            <Quality />
            <Read />
          </CardContent>
        </Card>
      </div>
    </MobileNavbarComponent>
  );
}
