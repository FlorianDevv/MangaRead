"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookmarkCheck, BookmarkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface Bookmark {
	itemName: string;
	types: string[];
}

export default function Bookmark() {
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

	useEffect(() => {
		const storedBookmarks = JSON.parse(
			localStorage.getItem("bookmarks") || "[]",
		);
		setBookmarks(storedBookmarks);
	}, []);

	if (!bookmarks.length) {
		return <p className="mx-2 text-center italic">{data.bookmark.empty}</p>;
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
				{bookmarks.map((bookmark) => (
					<div key={bookmark.itemName} className="flex-shrink-0 relative">
						<Card key={bookmark.itemName} {...bookmark} />
					</div>
				))}
			</div>
		</div>
	);
}
interface ButtonAddBookmarkProps {
	itemName: string;
	types: ("manga" | "anime")[];
}

export function ButtonAddBookmark({ itemName, types }: ButtonAddBookmarkProps) {
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);
	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(() => {
		const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
		setIsBookmarked(bookmarks.includes(itemName));
	}, [itemName]);

	const handleClick = () => {
		const bookmarks: Bookmark[] = JSON.parse(
			localStorage.getItem("bookmarks") || "[]",
		);
		const index = bookmarks.findIndex((b) => b.itemName === itemName);

		if (index !== -1) {
			const removedBookmark = bookmarks.splice(index, 1);
			localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
			setIsBookmarked(false);

			toast(`${decodeURIComponent(itemName)} ${data.bookmark.removeToast}`, {
				action: {
					label: data.bookmark.cancel,
					onClick: () => {
						const bookmarks = JSON.parse(
							localStorage.getItem("bookmarks") || "[]",
						);
						bookmarks.push(removedBookmark[0]);
						localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
						setIsBookmarked(true);
					},
				},
			});
		} else {
			const newBookmark = { itemName, types };
			bookmarks.push(newBookmark);
			localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
			setIsBookmarked(true);

			toast(`${decodeURIComponent(itemName)} ${data.bookmark.addToast}`, {
				action: {
					label: data.bookmark.cancel,
					onClick: () => {
						const bookmarks = JSON.parse(
							localStorage.getItem("bookmarks") || "[]",
						);
						const index = bookmarks.findIndex(
							(b: { itemName: string }) => b.itemName === itemName,
						);
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
		<>
			<Button variant="ghost" onClick={handleClick}>
				{isBookmarked ? <BookmarkCheck /> : <BookmarkIcon />}
			</Button>
		</>
	);
}
