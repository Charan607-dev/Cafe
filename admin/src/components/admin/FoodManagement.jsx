import { useState, useEffect } from "react";
import { UtensilsCrossed, Trash2, RefreshCw, LoaderCircle } from "lucide-react";
import AddFoodForm from "./AddFoodForm";

function FoodManagement({ apiUrl }) {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const fetchFoods = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(`${apiUrl}/api/foods`);
            if (!response.ok) {
                throw new Error("Failed to load food items.");
            }
            const data = await response.json();
            setFoods(data.foods || []);
        } catch (err) {
            console.error("Fetch foods error:", err);
            setError("Unable to load foods. Please check your backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, [apiUrl]);

    const handleFoodAdded = (newFood) => {
        setFoods((prev) => [...prev, newFood]);
    };

    const handleDeleteFood = async (id) => {
        if (!window.confirm("Are you sure you want to delete this food item?")) {
            return;
        }

        try {
            setDeletingId(id);
            const response = await fetch(`${apiUrl}/api/foods/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to delete food item.");
            }

            setFoods((prev) => prev.filter((food) => food.id !== id));
        } catch (err) {
            console.error("Delete food error:", err);
            alert(err.message || "Could not delete food item.");
        } finally {
            setDeletingId(null);
        }
    };

    const resolveImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
            return img;
        }
        return `${apiUrl}${img}`;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Food Menu Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Add, view, and remove food items available on the customer menu.
                    </p>
                </div>

                <button
                    onClick={fetchFoods}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
                >
                    <RefreshCw size={16} />
                    Refresh Foods
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left column: Add Food Form */}
                <div className="lg:col-span-1">
                    <AddFoodForm onFoodAdded={handleFoodAdded} apiUrl={apiUrl} />
                </div>

                {/* Right column: Food List */}
                <div className="space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <UtensilsCrossed className="text-orange-500" size={20} />
                            <h3 className="text-lg font-bold text-gray-900">
                                Current Foods ({foods.length})
                            </h3>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <LoaderCircle className="animate-spin text-orange-500" size={32} />
                        </div>
                    ) : foods.length === 0 ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                            <p className="text-lg font-semibold text-gray-700">No food items found.</p>
                            <p className="mt-1 text-sm text-gray-500">
                                Use the form to add your first food item.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        <tr>
                                            <th className="px-5 py-3.5">Item</th>
                                            <th className="px-5 py-3.5">Category</th>
                                            <th className="px-5 py-3.5">Price</th>
                                            <th className="px-5 py-3.5">Description</th>
                                            <th className="px-5 py-3.5 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {foods.map((food) => {
                                            const fullImg = resolveImageUrl(food.image);
                                            return (
                                                <tr key={food.id} className="transition hover:bg-gray-50">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {fullImg ? (
                                                                <img
                                                                    src={fullImg}
                                                                    alt={food.name}
                                                                    className="h-12 w-12 rounded-xl object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                                                                    {food.emoji || "🍽️"}
                                                                </div>
                                                            )}
                                                            <span className="font-bold text-gray-900">
                                                                {food.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="inline-block rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                                                            {food.category}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 font-bold text-gray-900">
                                                        ₹{food.price}
                                                    </td>
                                                    <td className="max-w-xs px-5 py-4 text-xs text-gray-500">
                                                        {food.description || "—"}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteFood(food.id)}
                                                            disabled={deletingId === food.id}
                                                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                                            title="Delete food item"
                                                        >
                                                            {deletingId === food.id ? (
                                                                <LoaderCircle size={18} className="animate-spin" />
                                                            ) : (
                                                                <Trash2 size={18} />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FoodManagement;
