import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

import { useEffect, useState } from "react";

export default function SelectPageNumber(
	pageNumber: number,
	setPageNumber: (arg0: number) => void,
	totalPages: number,
) {
	const [selectValue, setSelectValue] = useState(pageNumber.toString());

	useEffect(() => {
		setSelectValue(pageNumber.toString());
	}, [pageNumber]);

	return (
		<Select
			value={selectValue}
			onValueChange={(value: string) => {
				setPageNumber(Number(value));
				setSelectValue(value);
			}}
		>
			<SelectTrigger
				className="m-2 overflow-hidden max-w-sm p-2 hover:opacity-75 focus:outline-none ease-in-out transition-opacity duration-300 cursor-pointer w-auto"
				aria-label={`Changer de page. Page actuelle: ${pageNumber} page sur ${totalPages} pages`}
			>
				{`${pageNumber} / ${totalPages}`}
			</SelectTrigger>
			<SelectContent>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
					<SelectItem key={num} value={num.toString()}>
						{`${num} / ${totalPages}`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
