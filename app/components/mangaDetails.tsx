import Image from "next/image";

interface MangaDetailsProps {
  mangaNames: string[];
}

export default function MangaDetails({ mangaNames }: MangaDetailsProps) {
  return (
    <>
      {mangaNames.map((mangaName) => (
        <div key={mangaName} className="">
          <Image
            src={`/${mangaName}/Tome 01/01-001.webp`}
            alt={mangaName}
            className="rounded-md"
            width={64}
            height={64}
          />
          <div className="text-center mt-2 text-sm">{mangaName}</div>
        </div>
      ))}
    </>
  );
}
