import CheckPage from "@/app/components/checkpage";
import VolumeSelect from "@/app/components/select/volumeselect";
import "@/app/mangapage.css";
import { getDetails } from "@/app/types/getDetails";

export default async function Page({
  params,
}: {
  params: { slug: string; volume: string };
}) {
  const detailsArray = await getDetails(params.slug);

  const details = Array.isArray(detailsArray)
    ? detailsArray.find((item) => item.name === params.slug)
    : detailsArray;

  if (!details?.volumes) {
    return <div>Error 404</div>;
  }

  const volumes = details.volumes.map(
    (volume: { totalPages: number; name: string; type: string }) => {
      const totalPages = volume.totalPages;
      return { name: volume.name, totalPages, type: volume.type };
    }
  );

  const volumeDetails = volumes.find(
    (volume: { name: string }) => volume.name === params.volume
  );

  const totalPages = volumeDetails ? volumeDetails.totalPages : 0;

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <div className="flex flex-wrap justify-center ">
        <h1 className="w-full text-center text-3xl my-4">
          {decodeURIComponent(params.slug)}
        </h1>

        <VolumeSelect
          volumes={volumes}
          slug={params.slug}
          currentVolume={params.volume}
          isPage={true}
        />
      </div>
      <div className="flex justify-center">
        <CheckPage params={params} totalPages={totalPages} volumes={volumes} />
      </div>
    </div>
  );
}
