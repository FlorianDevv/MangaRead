import { MobileNavbarComponent } from "@/app/components/navbar/mobilenavbar";
import type { Metadata } from "next";
import Info from "./info";
interface Props {
	params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return {
		title: `${decodeURIComponent(params.slug)}`,
	};
}

export default function Page({ params }: Props) {
	return (
		<MobileNavbarComponent>
			<div className="dark:bg-black bg-white">
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
