import { API_BASE_URL } from "../../config/api";

function OrderSummary({ cart, total }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
                Order Summary
            </h2>

            <div className="mt-6 space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3">
                            {item.image ? (
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                                    <img
                                        src={
                                            item.image.startsWith("http") || item.image.startsWith("data:")
                                                ? item.image
                                                : `${API_BASE_URL}${item.image}`
                                        }
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                                    {item.emoji || "🍽️"}
                                </div>
                            )}

                            <div>
                                <p className="font-semibold text-gray-900">
                                    {item.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    ₹{item.price} × {item.quantity}
                                </p>
                            </div>
                        </div>

                        <p className="font-bold text-gray-900">
                            ₹{item.price * item.quantity}
                        </p>
                    </div>
                ))}
            </div>

            <div className="my-6 border-t border-gray-100" />

            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">
                    Total
                </span>

                <span className="text-2xl font-extrabold text-orange-500">
                    ₹{total}
                </span>
            </div>
        </div>
    );
}

export default OrderSummary;