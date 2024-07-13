// components/Navbar.tsx
import { getDetails } from "@/app/types/getDetails";
import { MobileNavbarComponent } from "./mobilenavbar";
import NavbarClient from "./navbarClient";
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

export default async function Navbar() {
	const details = await fetchAllItems();
	return (
		<nav className="bg-white/25 dark:bg-black/25 backdrop-filter backdrop-blur-lg p-2 shadow-md md:block hidden">
			<div className="flex justify-between items-center max-w-7xl mx-auto">
				<NavbarClient details={details} />
			</div>
		</nav>
	);
}

export function MobileNavbar() {
	return <MobileNavbarComponent />;
}
