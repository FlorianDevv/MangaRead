import { MobileNavbarComponent } from "@/app/components/navbar/mobilenavbar";
import Info from "./info";

interface Props {
	params: { slug: string };
}

interface Metadata {
	title: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return {
		title: `${decodeURIComponent(params.slug)}`,
	};
}

export default function Page({ params }: Props) {
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
