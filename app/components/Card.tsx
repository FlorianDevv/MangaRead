// MangaCard.tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Info from "../detail/[slug]/info";
import { ItemDetails } from "../types/getDetails";
import DynamicBlur from "./dynamicBlur";

export default function Card(details: ItemDetails) {
  const { name, types, pathImage } = details;

  return (
    <div className="relative flex flex-col items-stretch rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform group hover:scale-105 transition duration-300 w-full">
      <Dialog>
        <DialogTrigger>
          <div className="relative flex flex-col items-stretch shine">
            <DynamicBlur
              src={`/api/image?imagePath=${pathImage}`}
              alt={name}
              className="object-cover w-full h-80 sm:h-76 md:h-72 lg:h-76 2xl:h-96"
            />
            {types.includes("manga") && (
              <div
                className={`absolute ${
                  types.includes("anime") ? "bottom-10" : "bottom-2"
                } left-2 bg-blue-900 text-sm px-2 py-1 rounded`}
              >
                Manga
              </div>
            )}
            {types.includes("anime") && (
              <div className="absolute bottom-2 left-2 bg-red-900 text-sm px-2 py-1 rounded">
                Anime
              </div>
            )}
          </div>
          <h1 className="text-xs sm:text-sm md:text-base text-center transition-colors duration-300 group-hover:text-red-500 p-2">
            {name}
          </h1>
        </DialogTrigger>
        <DialogContent className=" h-full">
          <Info
            params={{
              slug: encodeURI(name),
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
