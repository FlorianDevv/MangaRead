import { MobileNavbarComponent } from "@/components/navbar/mobilenavbar";
import type { Metadata } from "next";
import CategorySelector from "../../components/catalogue";
import { type ItemDetails, getDetails } from "../types/getDetails";

let itemData: ItemDetails[] = [];
try {
	const details = await getDetails();
	itemData = Array.isArray(details) ? details : [details];
} catch (error) {
	itemData = [];
}

const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

export const metadata: Metadata = {
	title: data.metadata.catalog,
};

export default function Page() {
	return (
		<MobileNavbarComponent>
			<>
				<h1 className="text-center text-3xl mb-4 mt-6">{data.search.title}</h1>
				<CategorySelector itemData={itemData} />
			</>
		</MobileNavbarComponent>
	);
}
