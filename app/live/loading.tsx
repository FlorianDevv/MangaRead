import { MobileNavbarComponent } from "@/components/navbar/mobilenavbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<MobileNavbarComponent>
			<div className="flex flex-col items-center justify-center mt-8">
				{/* Current Item Skeleton */}
				<div className="flex flex-row items-center justify-center space-x-2 mb-8">
					<Card className="flex flex-col items-center justify-center rounded w-[200px]">
						<CardHeader className="text-center w-full">
							<Skeleton className="h-[200px] w-full mb-2" />
							<Skeleton className="h-6 w-3/4 mx-auto mb-2" />
							<Skeleton className="h-4 w-1/2 mx-auto" />
						</CardHeader>
						<CardContent className="text-center w-full">
							<Skeleton className="h-4 w-full mb-2" />
							<Skeleton className="h-2 w-full" />
						</CardContent>
					</Card>
					<div className="flex flex-col justify-center max-w-lg">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2 mb-4" />
						<div className="flex flex-wrap justify-center md:justify-start mb-4">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-6 w-16 rounded-full m-1" />
							))}
						</div>
						<Skeleton className="h-10 w-20" />
					</div>
				</div>

				{/* Schedule Items Skeleton */}
				<div className="overflow-x-auto max-w-full md:mx-8 mx-2">
					<Skeleton className="h-8 w-48 mb-4" />
					<div className="grid grid-flow-col gap-4">
						{[1, 2, 3, 4, 5, 6, 7].map((day) => (
							<div
								key={day}
								className="flex flex-col space-y-4 rounded p-2 border border-gray-300"
							>
								<Skeleton className="h-6 w-32 mx-auto mb-2" />
								{[1, 2, 3, 4, 5, 6, 7].map((item) => (
									<Card key={item} className="flex flex-col rounded">
										<CardHeader>
											<Skeleton className="h-[320px] w-[176px] mb-2" />
											<Skeleton className="h-4 w-3/4 mx-auto mb-1" />
											<Skeleton className="h-4 w-1/2 mx-auto mb-2" />
											<CardContent>
												<Skeleton className="h-4 w-full" />
											</CardContent>
										</CardHeader>
									</Card>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</MobileNavbarComponent>
	);
}
