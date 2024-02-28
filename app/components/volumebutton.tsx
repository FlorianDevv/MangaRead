"use client";

export default function VolumeButton({
  params,
  volume,
}: {
  params: any;
  volume: any;
}) {
  return (
    <button
      onClick={() => {
        const storedState = localStorage.getItem("mangaInfo");
        let mangaInfos = storedState ? JSON.parse(storedState) : [];

        const index = mangaInfos.findIndex(
          (info: { manga: string }) => info.manga === params.slug
        );

        let page = 1;
        if (index !== -1) {
          // Update the existing manga info
          page = mangaInfos[index].page;
          mangaInfos[index] = {
            manga: params.slug,
            volume: volume.name,
            page: page,
          };
        } else {
          // Add a new manga info
          mangaInfos.push({
            manga: params.slug,
            volume: volume.name,
            page: page,
          });
        }

        localStorage.setItem("mangaInfo", JSON.stringify(mangaInfos));
      }}
      className={`m-2 shadow-md rounded-lg overflow-hidden max-w-sm p-2 text-center ${
        volume.name === decodeURIComponent(params.volume)
          ? "bg-blue-700 text-white"
          : "bg-gray-700 text-white"
      }`}
    >
      <h4 className="text-l">{volume.name}</h4>
    </button>
  );
}
