import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, RefreshCw, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { API_BASE_URL } from "../config/api";

const STATUS_COLORS = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Preparing: "bg-purple-100 text-purple-700",
    Ready: "bg-green-100 text-green-700",
    Completed: "bg-gray-100 text-gray-600",
};

const STATUS_EMOJI = {
    Pending: "⏳",
    Confirmed: "✅",
    Preparing: "👨‍🍳",
    Ready: "🔔",
    Completed: "🎉",
};

function MyOrderCard({ order }) {
    const [expanded, setExpanded] = useState(false);

    const statusColor = STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600";
    const statusEmoji = STATUS_EMOJI[order.status] || "📋";

    const formattedDate = new Date(order.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                        🧾
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">
                            {order.orderId}
                        </p>
                        <p className="text-sm text-gray-500">
                            {formattedDate}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${statusColor}`}
                    >
                        <span>{statusEmoji}</span>
                        {order.status}
                    </span>

                    <span className="text-lg font-extrabold text-orange-500">
                        ₹{order.total}
                    </span>
                </div>
            </div>

            {/* Quick Info Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-50 px-5 py-3 text-sm text-gray-500">
                <span>
                    <span className="font-medium text-gray-700">Customer:</span>{" "}
                    {order.customer?.name}
                </span>

                <span>
                    <span className="font-medium text-gray-700">Table:</span>{" "}
                    {order.customer?.tableNumber}
                </span>

                <span>
                    <span className="font-medium text-gray-700">Type:</span>{" "}
                    {order.customer?.orderType}
                </span>

                <span>
                    <span className="font-medium text-gray-700">Items:</span>{" "}
                    {order.items?.length || 0}
                </span>
            </div>

            {/* Expand/Collapse Toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center justify-center gap-1.5 border-t border-gray-50 py-2.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
            >
                {expanded ? (
                    <>
                        Hide Details <ChevronUp size={16} />
                    </>
                ) : (
                    <>
                        View Details <ChevronDown size={16} />
                    </>
                )}
            </button>

            {/* Expanded Items */}
            {expanded && (
                <div className="border-t border-gray-100 px-5 py-4">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
                        Ordered Items
                    </h3>

                    <div className="space-y-3">
                        {order.items?.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-xl">
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

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="font-semibold text-gray-700">
                            Total
                        </span>
                        <span className="text-xl font-extrabold text-orange-500">
                            ₹{order.total}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

function MyOrders({ customerId, onBackToMenu }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/orders/customer/${customerId}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch orders.");
            }

            setOrders(data.orders);
            setError(null);
        } catch (err) {
            console.error("Fetch orders error:", err);
            setError("Unable to load your orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchOrders();
    }, [customerId]);

    // Stage 5: Auto-polling every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrders();
        }, 10000);

        return () => clearInterval(interval);
    }, [customerId]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-6 py-10">
                {/* Header */}
                <button
                    onClick={onBackToMenu}
                    className="mb-8 flex items-center gap-2 font-semibold text-gray-600 transition hover:text-orange-500"
                >
                    <ArrowLeft size={20} />
                    Back to Menu
                </button>

                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="font-semibold uppercase tracking-wider text-orange-500">
                            My Orders
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Order History
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Track the status of your orders in real time.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <RefreshCw size={14} className="animate-spin" style={{ animationDuration: "3s" }} />
                        Auto-updating
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                            <Clock size={32} className="animate-pulse text-orange-500" />
                        </div>
                        <p className="mt-4 text-lg font-semibold text-gray-700">
                            Loading your orders...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl">
                            ⚠️
                        </div>
                        <p className="mt-4 text-lg font-semibold text-gray-700">
                            {error}
                        </p>
                        <button
                            onClick={() => {
                                setLoading(true);
                                fetchOrders();
                            }}
                            className="mt-4 rounded-xl bg-orange-500 px-6 py-2.5 font-bold text-white transition hover:bg-orange-600"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 text-4xl">
                            <ShoppingBag size={40} className="text-orange-400" />
                        </div>

                        <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You haven't placed any orders. Browse our menu and
                            place your first order!
                        </p>

                        <button
                            onClick={onBackToMenu}
                            className="mt-6 rounded-xl bg-orange-500 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600"
                        >
                            Browse Menu
                        </button>
                    </div>
                )}

                {/* Orders List */}
                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <MyOrderCard
                                key={order.orderId}
                                order={order}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
