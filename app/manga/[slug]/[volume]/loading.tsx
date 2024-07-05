import { MobileNavbarComponent } from "@/app/components/navbar/mobilenavbar";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
	return (
		<MobileNavbarComponent>
			<div className="overflow-x-hidden overflow-y-hidden">
				<div className="flex flex-wrap justify-center">
					<Skeleton className="w-3/4 h-10 my-4" />
					<div className="flex justify-center space-x-2 w-full my-4">
						<Skeleton className="w-20 h-10" />
						<Skeleton className="w-40 h-10" />
						<Skeleton className="w-20 h-10" />
					</div>
				</div>
				<div className="flex justify-center">
					<Skeleton className="w-3/4 h-[60vh]" />
				</div>
			</div>
		</MobileNavbarComponent>
	);
};

export default Loading;
