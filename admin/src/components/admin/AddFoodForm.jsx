import { useState, useRef } from "react";
import { PlusCircle, Upload, X, LoaderCircle } from "lucide-react";

const CATEGORIES = ["Burgers", "Pizza", "Meals", "Drinks", "Desserts"];

function AddFoodForm({ onFoodAdded, apiUrl }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Burgers");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB.");
            return;
        }

        setError("");
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setImageBase64(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageBase64("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Please enter a food name.");
            return;
        }

        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            setError("Please enter a valid positive price.");
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(`${apiUrl}/api/foods`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    category,
                    price: Number(price),
                    description: description.trim(),
                    image: imageBase64 || null,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to add food item.");
            }

            setSuccess("Food item added successfully!");
            setName("");
            setCategory("Burgers");
            setPrice("");
            setDescription("");
            handleRemoveImage();

            if (onFoodAdded) {
                onFoodAdded(data.food);
            }
        } catch (err) {
            console.error("Add food error:", err);
            setError(err.message || "Failed to add food item.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <PlusCircle className="text-orange-500" size={22} />
                <h3 className="text-lg font-bold text-gray-900">Add New Food Item</h3>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Name */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Food Name *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Crispy Paneer Burger"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        required
                    />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Category *
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Price (₹) *
                        </label>
                        <input
                            type="number"
                            min="1"
                            step="any"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 120"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short description of the food item..."
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Food Image
                    </label>

                    {imagePreview ? (
                        <div className="relative mt-2 inline-block h-32 w-32 overflow-hidden rounded-xl border border-gray-200">
                            <img
                                src={imagePreview}
                                alt="Food preview"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/70 text-white hover:bg-gray-900"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-6 hover:border-orange-400 hover:bg-orange-50/30"
                        >
                            <Upload className="text-gray-400" size={24} />
                            <p className="mt-1 text-xs font-semibold text-gray-600">
                                Click to upload food image
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                >
                    {submitting ? (
                        <>
                            <LoaderCircle size={18} className="animate-spin" />
                            Adding Food...
                        </>
                    ) : (
                        "Add Food to Menu"
                    )}
                </button>
            </form>
        </div>
    );
}

export default AddFoodForm;
