import OrderDetails from "./OrderDetails";
import OrderStatus from "./OrderStatus";

function OrderSuccess({ order, onBackToMenu }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-6 py-12">
                {/* Success Header */}
                <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                        🎉
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Order Placed Successfully!
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-gray-600">
                        Thank you for ordering from Campus Café.
                        Your order has been received successfully.
                    </p>
                </div>

                {/* Order ID */}
                <div className="mx-auto mt-8 max-w-md rounded-2xl bg-orange-500 p-6 text-center text-white shadow-lg">
                    <p className="text-sm font-medium text-orange-100">
                        Your Order ID
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-wide">
                        {order.orderId}
                    </p>
                </div>

                {/* Order Information */}
                <div className="mt-8 space-y-6">
                    <OrderDetails order={order} />

                    {/* Items */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">
                            Items Ordered
                        </h2>

                        <div className="mt-5 space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                                            {item.emoji}
                                        </div>

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

                        <div className="mt-6 border-t border-gray-100 pt-5">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-gray-700">
                                    Total
                                </span>

                                <span className="text-2xl font-extrabold text-orange-500">
                                    ₹{order.total}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <OrderStatus order={order} />
                </div>

                {/* Back Button */}
                <div className="mt-10 text-center">
                    <button
                        onClick={onBackToMenu}
                        className="rounded-xl bg-orange-500 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;