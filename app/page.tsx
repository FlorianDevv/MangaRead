import dynamic from "next/dynamic";
import Card from "./components/Card";
import { MobileNavbarComponent } from "./components/mobilenavbar";
import { getDetails } from "./types/getDetails";
const PreviewVideo = dynamic(
  () => import("./components/carousel/previewVideo")
);
const ResumeReading = dynamic(() => import("./components/resumereading"));

export default function Home() {
  const Details = getDetails();

  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`../locales/${language}.json`);
  return (
    <MobileNavbarComponent activePage="Home">
      <div className="md:bg-[#0c0c0c] md:mx-24 lg:mx-48 2xl:mx-64">
        <div className="md:mx-8 mt-2">
          <PreviewVideo />
        </div>
        <div className=" p-4 mt-6 ">
          <ResumeReading />
        </div>
        <hr className="my-8" />
        <h2 className="w-full flex uppercase item-center justify-center text-xl md:text-2xl mb-4 mt-6 md:ml-4 md:justify-start md:items-start ">
          {data.home.allMangasAvailable}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-2 lg:mx-4">
          {Details.map((Detail) => (
            <Card key={Detail.name} Name={Detail.name} type={Detail.type} />
          ))}
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
