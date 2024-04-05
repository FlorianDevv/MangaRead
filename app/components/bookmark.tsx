"use client";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import MangaCardClient from "./mangaCardClient";
import { MobileNavbarComponent } from "./mobilenavbar";

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const storedBookmarks = JSON.parse(
      localStorage.getItem("bookmarks") || "[]"
    );
    setBookmarks(storedBookmarks);
  }, []);

  return (
    <MobileNavbarComponent>
      <div className="lg:mx-48 md:mx-24">
        <h2 className="flex justify-center items-center text-3xl mb-4 mt-2">
          Signets
          <div className="ml-2">
            <Bookmark />
          </div>
        </h2>
        <div className="mx-1 md:mx-8">
          {bookmarks.map((mangaName) => (
            <MangaCardClient key={mangaName} mangaName={mangaName} />
          ))}
        </div>
      </div>
    </MobileNavbarComponent>
  );
}
interface ButtonAddBookmarkProps {
  mangaName: string;
}

export function ButtonAddBookmark({ mangaName }: ButtonAddBookmarkProps) {
  const handleClick = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (!bookmarks.includes(mangaName)) {
      bookmarks.push(mangaName);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  };

  return (
    <div>
      <Button variant="secondary" className="" onClick={handleClick}>
        <BookmarkIcon className="mr-1" />
        Ajoutez à votre liste de lecture
      </Button>
    </div>
  );
}
