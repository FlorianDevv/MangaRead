import { MobileNavbarComponent } from "@/app/components/navbar/mobilenavbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCatalogue() {
	return (
		<MobileNavbarComponent activePage="Catalogue">
			<div className="flex flex-col justify-center mb-4 mx-8">
				{/* Skeleton for types and categories */}
				<div className="flex flex-row justify-center items-center">
					{[...Array(4)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Skeleton key={index} className="h-6 w-24 m-1" />
					))}
				</div>
				<div className="flex flex-wrap justify-center mt-4">
					{[...Array(6)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Skeleton key={index} className="h-6 w-24 m-1" />
					))}
				</div>
			</div>
			<div className="flex justify-center items-center flex-col">
				{/* Skeleton for search input */}
				<Skeleton className="h-10 w-64 mx-2 rounded-md" />
				{/* Skeletons for items */}
				<div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mx-2">
					{[...Array(10)].map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Skeleton key={index} className="h-60 w-full" />
					))}
				</div>
			</div>
		</MobileNavbarComponent>
	);
}
