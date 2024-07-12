import { MobileNavbarComponent } from "@/app/components/navbar/mobilenavbar";

export default async function Loading() {
	return (
		<MobileNavbarComponent activePage="Live">
			<div className="fixed inset-0 flex items-center justify-center dark:bg-black bg-white">
				<div className="spinner" />
			</div>
		</MobileNavbarComponent>
	);
}
