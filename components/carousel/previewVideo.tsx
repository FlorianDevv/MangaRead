import type { ItemDetails } from "@/app/types/getDetails";
import EmblaCarousel from "./Carousel";

interface PreviewVideoProps {
	Details: ItemDetails[];
}

export default function PreviewVideo({ Details }: PreviewVideoProps) {
	// Convert Details to an array if it's not already
	if (!Array.isArray(Details)) {
		Details = [Details];
	}

	// Randomize the array
	Details.sort(() => Math.random() - 0.5);

	// Get a subset of the array
	Details = Details.slice(0, 8);

	// For each item in Details, if it has both types, randomly choose one
	Details = Details.map((detail) => {
		if (detail.types.includes("manga") && detail.types.includes("anime")) {
			const randomNumber = Math.random();
			const chosenType = randomNumber < 0.5 ? "manga" : "anime";
			detail.types = [chosenType];
		}
		return detail;
	});
	return (
		<>
			<EmblaCarousel Details={Details} />
		</>
	);
}
