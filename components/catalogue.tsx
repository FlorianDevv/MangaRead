"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { ItemDetails } from "../app/types/getDetails";
import CardClient from "./CardClient";

export default function CategorySelector({
	itemData,
}: {
	itemData: Array<ItemDetails>;
}) {
	const [selectedTypes, setSelectedTypes] = useState<Array<ItemType>>([]);
	const categories = Array.from(
		new Set(itemData.flatMap((item) => item.categories ?? [])),
	);
	const types = Array.from(new Set(itemData.flatMap((item) => item.types)));

	const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
		[],
	);

	const [filteredItemData, setFilteredItemData] = useState(itemData);
	const [searchValue, setSearchValue] = useState("");

	type ItemType = ItemDetails["types"][0];

	const handleTypeClick = (type: ItemType) => {
		let newSelectedTypes: ItemType[];
		if (selectedTypes.includes(type)) {
			newSelectedTypes = selectedTypes.filter((t) => t !== type);
		} else {
			newSelectedTypes = [...selectedTypes, type];
		}
		setSelectedTypes(newSelectedTypes);

		if (newSelectedTypes.length === 0) {
			setFilteredItemData(itemData);
		} else {
			const filtered = itemData.filter((item: ItemDetails) =>
				newSelectedTypes.some((type) => item.types.includes(type)),
			);
			setFilteredItemData(filtered);
		}
	};

	const handleCategoryClick = (category: string) => {
		let newSelectedCategories: string[];
		if (selectedCategories.includes(category)) {
			newSelectedCategories = selectedCategories.filter((c) => c !== category);
		} else {
			newSelectedCategories = [...selectedCategories, category];
		}
		setSelectedCategories(newSelectedCategories);

		if (newSelectedCategories.length === 0) {
			setFilteredItemData(itemData);
		} else {
			const filtered = itemData.filter(
				(item: ItemDetails) =>
					item.categories &&
					newSelectedCategories.every((cat) => item.categories?.includes(cat)),
			);
			setFilteredItemData(filtered);
		}
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	const displayedItemData = filteredItemData.filter((item) =>
		item.name.toLowerCase().includes(searchValue.toLowerCase()),
	);
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);
	return (
		<div>
			<div className="flex flex-col justify-center mb-4 mb:mx-8">
				<div className="flex flex-row justify-center items-center">
					{types.map((type) => (
						<label key={type} className="inline-flex items-center m-1 text-lg">
							<input
								type="checkbox"
								className="form-checkbox h-5 w-5 "
								checked={selectedTypes.includes(type)}
								onChange={() => handleTypeClick(type)}
							/>
							<span className="ml-2 uppercase">{type}</span>
						</label>
					))}
				</div>
				<div className="flex flex-wrap justify-center mt-4">
					{categories.map((category) => (
						<label key={category} className="inline-flex items-center m-1">
							<input
								type="checkbox"
								className="form-checkbox h-5 w-5"
								checked={selectedCategories.includes(category)}
								onChange={() => handleCategoryClick(category)}
							/>
							<span className="ml-2 ">{category}</span>
						</label>
					))}
				</div>
			</div>
			<div className="flex justify-center items-center flex-col">
				<Input
					placeholder={data.search.title}
					value={searchValue}
					onChange={handleSearchChange}
					className="p-2 mx-2 rounded-md  md:w-72 w-64 font-normal"
				/>
				<div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mx-2">
					{displayedItemData.map((item) => (
						<CardClient key={item.name} {...item} />
					))}
				</div>
			</div>
		</div>
	);
}
