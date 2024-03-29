import DynamicBlur from "./dynamicBlur";

export default function MangaCard({ mangaName }: { mangaName: string }) {
  return (
    <div className="flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl ease-in-out transform hover:opacity-75 hover:scale-105 transition-transform duration-300">
      <div className="relative h-32 sm:h-48 md:h-64 w-32 sm:w-48 md:w-64">
        <DynamicBlur
          src={`/${mangaName}/Tome 01/01-001.webp`}
          alt={mangaName}
        />
      </div>
      <div className="p-2">
        <h4 className="text-sm text-center text-white">{mangaName}</h4>
      </div>
    </div>
  );
}
