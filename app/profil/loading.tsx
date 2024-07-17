import { MobileNavbarComponent } from "@/components/navbar/mobilenavbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<MobileNavbarComponent>
			<div className="lg:mx-48 md:mx-24">
				<Skeleton className="h-5 w-full" />
				<hr className="my-8" />
				<Skeleton className="h-5 w-full" />
				<hr className="my-8" />
				<div className="flex justify-center items-center mb-4 mt-8">
					<div className="w-64">
						<Skeleton className="h-10 w-full" />
						<div className="space-y-4">
							<Skeleton className="h-5 w-11/12" />
							<Skeleton className="h-5 w-11/12" />
						</div>
					</div>
					<Skeleton className="h-38 w-38" />
				</div>
			</div>
		</MobileNavbarComponent>
	);
}
