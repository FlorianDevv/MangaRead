import CheckPage from "@/app/components/checkpage";
import VolumeSelect from "@/app/components/select/volumeselect";
import "@/app/mangapage.css";
import { getDetails } from "@/app/types/getDetails";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
	params: { slug: string; volume: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return {
		title: `${decodeURIComponent(params.slug)}`,
	};
}

export default async function Page({ params }: Props) {
	const detailsArray = await getDetails(params.slug);

	const details = Array.isArray(detailsArray)
		? detailsArray.find((item) => item.name === params.slug)
		: detailsArray;

	if (!details?.volumes) {
		console.log(detailsArray, details, params.slug, params.volume);
		return <div>Error 404</div>;
	}

	const volumes = details.volumes.map(
		(volume: { totalPages: number; name: string; type: string }) => {
			const totalPages = volume.totalPages;
			return { name: volume.name, totalPages, type: volume.type };
		},
	);

	const volumeDetails = volumes.find(
		(volume: { name: string }) => volume.name === params.volume,
	);

	const totalPages = volumeDetails ? volumeDetails.totalPages : 0;

	return (
		<div className="overflow-x-hidden overflow-y-hidden">
			<div className="flex flex-wrap justify-center ">
				<h1 className="w-full text-center text-3xl my-4">
					{decodeURIComponent(params.slug)}
				</h1>

				<VolumeSelect
					volumes={volumes}
					slug={params.slug}
					currentVolume={params.volume}
					isPage={true}
				/>
			</div>
			<div className="flex justify-center">
				<CheckPage params={params} totalPages={totalPages} volumes={volumes} />
			</div>
		</div>
	);
}
