import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ExportImportLocalStorage() {
	const [localStorageData, setLocalStorageData] = useState("");

	const exportLocalStorage = async () => {
		const data: Record<string, unknown> = {};
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i) ?? "";
			const value = localStorage.getItem(key);
			data[key] = value ? JSON.parse(value) : null;
		}
		const dataString = JSON.stringify(data);
		setLocalStorageData(dataString);

		try {
			await navigator.clipboard.writeText(dataString);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	const importLocalStorage = () => {
		const language = process.env.DEFAULT_LANGUAGE;
		const data = require(`@/locales/${language}.json`);
		const confirmImport = confirm(data.settings.save.alert);
		if (confirmImport) {
			localStorage.clear();
			const dataToImport = JSON.parse(localStorageData);
			for (const key of Object.keys(dataToImport)) {
				localStorage.setItem(key, JSON.stringify(dataToImport[key]));
			}
		}
	};

	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);

	return (
		<div className="flex flex-col items-center justify-center h-52">
			<h1 className="text-2xl font-bold mb-4">{data.settings.save.title}</h1>
			<Button className="mb-2" onClick={exportLocalStorage}>
				{data.settings.save.export}
			</Button>
			<Input
				className="mb-2 p-2 w-64"
				value={localStorageData}
				onChange={(e) => setLocalStorageData(e.target.value)}
			/>
			<Button onClick={importLocalStorage}>{data.settings.save.import}</Button>
		</div>
	);
}
