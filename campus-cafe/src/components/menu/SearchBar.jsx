import { Search } from "lucide-react";

function SearchBar({ search, onSearchChange }) {
    return (
        <div className="mx-auto mb-8 max-w-xl">
            <div className="relative">
                <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search food..."
                    className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-5 outline-none focus:border-orange-500"
                />
            </div>
        </div>
    );
}

export default SearchBar;