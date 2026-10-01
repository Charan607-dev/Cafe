function CategoryFilter({
    categories,
    activeCategory,
    onCategoryChange,
}) {
    return (
        <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold ${activeCategory === category
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;