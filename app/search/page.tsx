import { MobileNavbarComponent } from "@/app/components/navbar/mobilenavbar";
import CategorySelector from "../components/catalogue";
import { getDetails, ItemDetails } from "../types/getDetails";

let itemData: ItemDetails[] = [];
try {
  itemData = getDetails();
} catch (error) {
  console.error(`Failed to read public directory: ${error}`);
}

const language = process.env.DEFAULT_LANGUAGE;
const data = require(`@/locales/${language}.json`);

export default function Page() {
  return (
    <MobileNavbarComponent activePage="Search">
      <>
        <h1 className="text-center text-3xl mb-4 mt-6">{data.search.title}</h1>
        <CategorySelector itemData={itemData} />
      </>
    </MobileNavbarComponent>
  );
}
