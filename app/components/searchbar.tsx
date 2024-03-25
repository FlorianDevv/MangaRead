export default function SearchBar(mangaNames: string[]) {
  return (
    <div className="flex items-center justify-center">
      <input type="text" placeholder="Search" className="p-2 mx-2 rounded-md" />
    </div>
  );
}
