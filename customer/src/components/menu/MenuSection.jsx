import { useEffect, useMemo, useState } from "react";
import { Search, Minus, Plus } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

const defaultFoods = [
    { id: 1, name: "Classic Burger", category: "Burgers", price: 99, emoji: "🍔", description: "Juicy burger with fresh vegetables and special sauce." },
    { id: 2, name: "Cheese Burger", category: "Burgers", price: 119, emoji: "🍔", description: "Classic burger loaded with melted cheese." },
    { id: 3, name: "Margherita Pizza", category: "Pizza", price: 149, emoji: "🍕", description: "Classic pizza topped with cheese and tomato." },
    { id: 4, name: "Paneer Pizza", category: "Pizza", price: 179, emoji: "🍕", description: "Delicious pizza topped with spicy paneer." },
    { id: 5, name: "Veg Fried Rice", category: "Meals", price: 110, emoji: "🍚", description: "Flavorful fried rice with fresh vegetables." },
    { id: 6, name: "Chicken Rice", category: "Meals", price: 140, emoji: "🍗", description: "Tasty chicken rice prepared with aromatic spices." },
    { id: 7, name: "Cold Coffee", category: "Drinks", price: 70, emoji: "🥤", description: "Refreshing chilled coffee with a creamy finish." },
    { id: 8, name: "Fresh Lime Soda", category: "Drinks", price: 50, emoji: "🍋", description: "Refreshing lime soda perfect for a hot day." },
    { id: 9, name: "Chocolate Brownie", category: "Desserts", price: 80, emoji: "🍫", description: "Soft and rich chocolate brownie." },
    { id: 10, name: "Ice Cream", category: "Desserts", price: 60, emoji: "🍨", description: "Creamy and delicious ice cream." },
];

function MenuSection({
    onAddToCart,
    cart = [],
    onIncrease,
    onDecrease,
}) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadFoods() {
            try {
                setLoading(true);
                setError(false);
                const response = await fetch(`${API_BASE_URL}/api/foods`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.foods) {
                        setFoods(data.foods);
                    } else {
                        setFoods([]);
                    }
                } else {
                    setError(true);
                }
            } catch (err) {
                console.warn("Could not fetch foods from API:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        loadFoods();
    }, []);

    const categories = useMemo(() => {
        const cats = [...new Set(foods.map((f) => f.category))];
        return ["All", ...cats];
    }, [foods]);

    const filteredFoods = useMemo(() => {
        return foods.filter((food) => {
            const matchesCategory =
                category === "All" || food.category === category;

            const matchesSearch = food.name
                .toLowerCase()
                .includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [search, category, foods]);

    const getQuantity = (foodId) => {
        const item = cart.find((item) => item.id === foodId);
        return item ? item.quantity : 0;
    };

    return (
        <section id="menu" className="bg-gray-50 py-20">
            <div className="mx-auto max-w-7xl px-6">

                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="font-semibold uppercase tracking-wider text-orange-500">
                        Our Menu
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Something Delicious for Everyone
                    </h2>

                    <p className="mt-4 text-gray-600">
                        Explore our campus favorites and find something you'll love.
                    </p>
                </div>

                {/* Search */}
                <div className="mx-auto mt-10 max-w-xl">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search food..."
                            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {categories.map((item) => (
                        <button
                            key={item}
                            onClick={() => setCategory(item)}
                            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${category === item
                                    ? "bg-orange-500 text-white"
                                    : "bg-white text-gray-700 hover:bg-orange-100"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Content States */}
                {loading ? (
                    <div className="mt-12 flex items-center justify-center p-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="mt-10 rounded-2xl bg-white p-12 text-center shadow-sm">
                        <p className="text-lg font-semibold text-red-500">
                            Failed to load food menu.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Please check your connection and try refreshing the page.
                        </p>
                    </div>
                ) : foods.length === 0 ? (
                    <div className="mt-10 rounded-2xl bg-white p-12 text-center shadow-sm">
                        <p className="text-lg font-semibold text-gray-800">
                            No food items available right now.
                        </p>
                    </div>
                ) : filteredFoods.length === 0 ? (
                    <div className="mt-10 rounded-2xl bg-white p-12 text-center shadow-sm">
                        <p className="text-lg font-semibold text-gray-900">
                            No food found.
                        </p>
                        <p className="mt-2 text-gray-500">
                            Try a different search or category.
                        </p>
                    </div>
                ) : (
                    /* Food Cards */
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredFoods.map((food) => {
                            const quantity = getQuantity(food.id);

                            return (
                                <div
                                    key={food.id}
                                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {/* Food Image */}
                                    {food.image ? (
                                        <div className="h-48 bg-orange-50">
                                            <img
                                                src={food.image.startsWith("http") || food.image.startsWith("data:") ? food.image : `${API_BASE_URL}${food.image}`}
                                                alt={food.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-48 items-center justify-center bg-orange-50 text-7xl">
                                            {food.emoji || "🍽️"}
                                        </div>
                                    )}

                                    <div className="p-5">
                                        {/* Name + Price */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {food.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-orange-500">
                                                    {food.category}
                                                </p>
                                            </div>

                                            <span className="font-bold text-gray-900">
                                                ₹{food.price}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="mt-3 text-sm leading-6 text-gray-600">
                                            {food.description}
                                        </p>

                                        {/* Add / Quantity Controls */}
                                        {quantity === 0 ? (
                                            <button
                                                onClick={() => onAddToCart(food)}
                                                className="mt-5 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
                                            >
                                                + Add to Cart
                                            </button>
                                        ) : (
                                            <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-500 px-3 py-2 text-white">
                                                <button
                                                    onClick={() =>
                                                        onDecrease(food.id)
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-orange-500 transition hover:bg-orange-50"
                                                >
                                                    <Minus size={18} />
                                                </button>

                                                <span className="text-lg font-bold">
                                                    {quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        onIncrease(food.id)
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-orange-500 transition hover:bg-orange-50"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </section>
    );
}

export default MenuSection;