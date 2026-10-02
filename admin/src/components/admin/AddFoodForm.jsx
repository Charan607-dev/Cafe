import { useState, useRef, useEffect } from "react";
import { PlusCircle, Edit3, Upload, X, LoaderCircle } from "lucide-react";

const CATEGORIES = ["Burgers", "Pizza", "Meals", "Drinks", "Desserts"];

function AddFoodForm({ onFoodAdded, onFoodUpdated, editingFood, onCancelEdit, apiUrl }) {
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

    // Sync form values when editingFood changes
    useEffect(() => {
        if (editingFood) {
            setName(editingFood.name || "");
            setCategory(editingFood.category || "Burgers");
            setPrice(editingFood.price?.toString() || "");
            setDescription(editingFood.description || "");

            if (editingFood.image) {
                const fullImg =
                    editingFood.image.startsWith("http://") ||
                    editingFood.image.startsWith("https://") ||
                    editingFood.image.startsWith("data:")
                        ? editingFood.image
                        : `${apiUrl}${editingFood.image}`;
                setImagePreview(fullImg);
            } else {
                setImagePreview(null);
            }
            setImageBase64(""); // only set if user picks a new file
            setError("");
            setSuccess("");
        } else {
            resetForm();
        }
    }, [editingFood, apiUrl]);

    const resetForm = () => {
        setName("");
        setCategory("Burgers");
        setPrice("");
        setDescription("");
        setImagePreview(null);
        setImageBase64("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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
        setImageBase64(editingFood ? "" : "");
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

        const isEditing = Boolean(editingFood);

        try {
            setSubmitting(true);

            const payload = {
                name: name.trim(),
                category,
                price: Number(price),
                description: description.trim(),
            };

            // Image logic:
            if (imageBase64) {
                payload.image = imageBase64;
            } else if (isEditing && !imagePreview) {
                // Image was explicitly removed
                payload.image = null;
            }

            const url = isEditing
                ? `${apiUrl}/api/foods/${editingFood.id}`
                : `${apiUrl}/api/foods`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Failed to ${isEditing ? "update" : "add"} food item.`);
            }

            setSuccess(`Food item ${isEditing ? "updated" : "added"} successfully!`);

            if (isEditing) {
                if (onFoodUpdated) {
                    onFoodUpdated(data.food);
                }
            } else {
                resetForm();
                if (onFoodAdded) {
                    onFoodAdded(data.food);
                }
            }
        } catch (err) {
            console.error("Save food error:", err);
            setError(err.message || "Failed to save food item.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    {editingFood ? (
                        <Edit3 className="text-orange-500" size={22} />
                    ) : (
                        <PlusCircle className="text-orange-500" size={22} />
                    )}
                    <h3 className="text-lg font-bold text-gray-900">
                        {editingFood ? "Edit Food Item" : "Add New Food Item"}
                    </h3>
                </div>

                {editingFood && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                )}
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
                                title="Remove image"
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

                {/* Submit & Cancel Buttons */}
                <div className="flex gap-3">
                    {editingFood && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle size={18} className="animate-spin" />
                                {editingFood ? "Saving..." : "Adding..."}
                            </>
                        ) : (
                            editingFood ? "Save Changes" : "Add Food to Menu"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddFoodForm;
