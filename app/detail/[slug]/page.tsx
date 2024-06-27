import { MobileNavbarComponent } from "@/app/components/navbar/mobilenavbar";
import Info from "./info";

export default function Page({ params }: { params: { slug: string } }) {
	return (
		<MobileNavbarComponent>
			<div className="bg-black">
				<div className="max-w-3xl mx-auto ">
					<Info
						params={{
							slug: params.slug,
						}}
					/>
				</div>
			</div>
		</MobileNavbarComponent>
	);
}
