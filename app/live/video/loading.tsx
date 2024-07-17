import { MobileNavbarComponent } from "@/components/navbar/mobilenavbar";

export default async function Loading() {
	return (
		<MobileNavbarComponent>
			<div className="fixed inset-0 flex items-center justify-center dark:bg-black bg-white">
				<div className="spinner" />
			</div>
		</MobileNavbarComponent>
	);
}
