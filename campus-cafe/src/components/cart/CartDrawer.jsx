import { Minus, Plus, Trash2, X } from "lucide-react";

function CartDrawer({
    open,
    onClose,
    cart,
    total,
    onIncrease,
    onDecrease,
    onRemove,
    onCheckout,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">

            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b px-6 py-5">
                    <h2 className="text-xl font-bold">
                        Your Cart 🛒
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6">

                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="text-6xl">🛒</div>

                            <h3 className="mt-5 text-xl font-bold">
                                Your cart is empty
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Add something delicious from the menu.
                            </p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="border-b py-5"
                            >
                                <div className="flex gap-4">

                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-50 text-3xl">
                                        {item.emoji}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-bold">
                                                    {item.name}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    ₹{item.price}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    onRemove(item.id)
                                                }
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="mt-3 flex items-center gap-3">

                                            <button
                                                onClick={() =>
                                                    onDecrease(item.id)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full border"
                                            >
                                                <Minus size={14} />
                                            </button>

                                            <span className="font-bold">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    onIncrease(item.id)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full border"
                                            >
                                                <Plus size={14} />
                                            </button>

                                            <span className="ml-auto font-bold">
                                                ₹{item.price * item.quantity}
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>

                {cart.length > 0 && (
                    <div className="border-t p-6">

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>

                        <button
                            onClick={onCheckout}
                            className="mt-5 w-full rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
                        >
                            Place Demo Order
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}

export default CartDrawer;