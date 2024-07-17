import { ChevronLeft, ChevronRight } from "lucide-react";

interface PreviousPageButtonProps {
	previousPage: () => void;
}
export function PreviousPageButton({ previousPage }: PreviousPageButtonProps) {
	return (
		<button
			type="button"
			className="absolute top-1/2 left-0 transform -translate-y-1/2 w-5/12 h-full opacity-0 hover:opacity-70 flex items-center justify-start ml-4"
			onClick={previousPage}
			style={{
				cursor:
					"url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjgwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LWJpZy1sZWZ0Ij48cGF0aCBkPSJNMTggMTVoLTZ2NGwtNy03IDctN3Y0aDZ2NnoiLz48L3N2Zz4='), auto",
			}}
		>
			<ChevronLeft className="w-40 h-40 md:hidden block" />
		</button>
	);
}

export function NextPageButton({
	nextPage,
	disabled,
}: {
	nextPage: () => void;
	disabled: boolean;
}) {
	return (
		<button
			type="button"
			className="absolute top-1/2 right-0 transform -translate-y-1/2 w-5/12 h-full opacity-0 hover:opacity-70 flex items-center justify-end mr-4"
			onClick={nextPage}
			disabled={disabled}
			style={{
				cursor:
					"url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjgwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LWJpZy1yaWdodCI+PHBhdGggZD0iTTYgOWg2VjVsNyA3LTcgN3YtNEg2Vjl6Ii8+PC9zdmc+'), auto",
			}}
		>
			<ChevronRight className="w-40 h-40 md:hidden block" />
		</button>
	);
}
