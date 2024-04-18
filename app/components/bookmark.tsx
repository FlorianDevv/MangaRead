"use client";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MangaCardClient from "./mangaCardClient";
export default function Bookmark() {
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const storedBookmarks = JSON.parse(
      localStorage.getItem("bookmarks") || "[]"
    );
    setBookmarks(storedBookmarks);
    console.log(storedBookmarks);
  }, []);

  const deleteManga = (index: number) => {
    const newBookmarks = [...bookmarks];
    newBookmarks.splice(index, 1);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  if (!bookmarks.length) {
    return null;
  }

  return (
    <div className="mx-2">
      <h2 className="flex justify-center items-center text-3xl mb-4 mt-2">
        {data.bookmark.title}
        <div className="ml-2">
          <BookmarkIcon />
        </div>
      </h2>
      <div className="space-x-4 md:mx-8 flex overflow-x-scroll hover:cursor-default overflow-y-hidden">
        {bookmarks.map((mangaName, index) => (
          <div key={mangaName} className="flex-shrink-0 relative">
            <MangaCardClient mangaName={mangaName} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteManga(index);
              }}
              className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white hover:text-red-600 bg-black shadow-lg shadow-black outline outline-2 outline-gray-700 rounded transition-all duration-200"
              title={data.bookmark.remove}
            >
              <X />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
interface ButtonAddBookmarkProps {
  mangaName: string;
}

export function ButtonAddBookmark({ mangaName }: ButtonAddBookmarkProps) {
  const language = process.env.DEFAULT_LANGUAGE;
  const data = require(`@/locales/${language}.json`);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(mangaName));
  }, [mangaName]);

  const handleClick = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const index = bookmarks.indexOf(mangaName);

    if (index !== -1) {
      bookmarks.splice(index, 1);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(false);

      toast(`${decodeURIComponent(mangaName)} ${data.bookmark.removeToast}`, {
        action: {
          label: data.bookmark.cancel,
          onClick: () => {
            const bookmarks = JSON.parse(
              localStorage.getItem("bookmarks") || "[]"
            );
            if (!bookmarks.includes(mangaName)) {
              bookmarks.push(mangaName);
              localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
              setIsBookmarked(true);
            }
          },
        },
      });
    } else {
      bookmarks.push(mangaName);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(true);

      toast(`${decodeURIComponent(mangaName)} ${data.bookmark.addToast}`, {
        action: {
          label: data.bookmark.cancel,
          onClick: () => {
            const bookmarks = JSON.parse(
              localStorage.getItem("bookmarks") || "[]"
            );
            const index = bookmarks.indexOf(mangaName);
            if (index !== -1) {
              bookmarks.splice(index, 1);
              localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
              setIsBookmarked(false);
            }
          },
        },
      });
    }
  };

  return (
    <div>
      <Button variant="secondary" onClick={handleClick}>
        <BookmarkIcon className="mr-1" />
        {isBookmarked ? data.bookmark.remove : data.bookmark.add}
      </Button>
    </div>
  );
}
