// components/Navbar.tsx
import { getDetails } from "@/app/types/getDetails";
import { Button } from "@/components/ui/button";
import { CircleUser, Github, Home, LibraryBig, Tv } from "lucide-react";
import { ModeToggle } from "../modeToggle";
import SearchBar from "../searchbar";
import { MobileNavbarComponent } from "./mobilenavbar";
import NavItem from "./navItem";
async function fetchAllItems() {
	try {
		const itemsDetails = await getDetails();
		const transformedData = (
			Array.isArray(itemsDetails) ? itemsDetails : [itemsDetails]
		).map((item) => {
			let imagePath = "";
			if (item.types.includes("manga")) {
				imagePath = `/api/image?path=${item.name}/manga/01/01-001.webp`;
			} else if (item.types.includes("anime")) {
				imagePath = `/api/image?path=${item.name}/anime/thumbnail.webp`;
			}
			return { name: item.name, imagePath };
		});
		return transformedData;
	} catch (error) {
		return [];
	}
}
const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

export default async function Navbar() {
	const details = await fetchAllItems();
	return (
		<nav className="bg-white/25 dark:bg-black/25 backdrop-filter backdrop-blur-lg p-2 shadow-md md:block hidden">
			<div className="flex justify-between items-center max-w-7xl mx-auto">
				<>
					<div className="flex items-center">
						<NavItem href="/">
							<Home size={20} />
							<span className="ml-2">{data.navbar.home}</span>
						</NavItem>
						<NavItem href="/profil">
							<CircleUser size={20} />
							<span className="ml-2">{data.navbar.profil}</span>
						</NavItem>
						<NavItem href="/live">
							<Tv size={20} />
							<span className="ml-2">Live</span>
						</NavItem>
					</div>
					<div className="flex items-center space-x-4">
						<NavItem href="/search">
							<LibraryBig size={20} />
							<span className="ml-2"> {data.navbar.catalog}</span>
						</NavItem>
						<SearchBar details={details} />
						<Button variant="ghost" aria-label="View source on GitHub">
							<a
								href="https://github.com/FlorianDevv/MangaRead"
								target="_blank"
								rel="noopener noreferrer"
							>
								<p className="transition-colors hover:text-foreground/80">
									<Github size={20} />
								</p>
							</a>
						</Button>
						<ModeToggle />
					</div>
				</>
			</div>
		</nav>
	);
}

export function MobileNavbar() {
	return <MobileNavbarComponent />;
}
