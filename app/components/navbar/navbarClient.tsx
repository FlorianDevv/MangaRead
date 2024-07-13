"use client";
import { Button } from "@/components/ui/button";
import { CircleUser, Github, Home, LibraryBig, Tv } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../modeToggle";
import SearchBar from "../searchbar";

interface NavbarClientProps {
	details: { name: string; imagePath: string }[];
}

export default function NavbarClient({ details }: NavbarClientProps) {
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);
	const pathname = usePathname();
	const isActive = (path: string) => {
		return pathname === path;
	};
	return (
		<>
			<div className="flex items-center">
				<Link
					href="/"
					className={`flex transition-colors hover:text-foreground/80 ${isActive("/") ? "text-foreground" : "text-foreground/60"} mr-4 lg:mr-8`}
				>
					<Button variant="ghost">
						<Home size={20} />
						<span className="ml-2">{data.navbar.home}</span>
					</Button>
				</Link>
				<Link
					href="/profil"
					className={`flex transition-colors hover:text-foreground/80 ${isActive("/profil") ? "text-foreground" : "text-foreground/60"} mr-4 lg:mr-8`}
				>
					<Button variant="ghost">
						<CircleUser size={20} />
						<span className="ml-2">{data.navbar.profil}</span>
					</Button>
				</Link>
				<Link
					href="/live"
					className={`flex transition-colors hover:text-foreground/80 ${isActive("/live") ? "text-foreground" : "text-foreground/60"}`}
				>
					<Button variant="ghost">
						<Tv size={20} />
						<span className="ml-2">Live</span>
					</Button>
				</Link>
			</div>
			<div className="flex items-center space-x-4">
				<Link
					href="/search"
					className={`flex transition-colors hover:text-foreground/80 ${isActive("/search") ? "text-foreground" : "text-foreground/60"}`}
				>
					<Button variant="ghost">
						<LibraryBig size={20} />
						<span className="ml-2"> {data.navbar.catalog}</span>
					</Button>
				</Link>
				<SearchBar details={details} />
				<a
					href="https://github.com/FlorianDevv/MangaRead"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="View source on GitHub"
				>
					<Button variant="ghost">
						<p className="transition-colors hover:text-foreground/80">
							<Github size={20} />
						</p>
					</Button>
				</a>
				<ModeToggle />
			</div>
		</>
	);
}
