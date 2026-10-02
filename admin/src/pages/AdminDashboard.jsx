import { useEffect, useState } from "react";
import {
    ShoppingBag,
    IndianRupee,
    Clock3,
    ClipboardList,
    RefreshCw,
    LogOut,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

const API_URL = API_BASE_URL;

function AdminDashboard() {
    const [stats, setStats] = useState({
        todayOrders: 0,
        todayIncome: 0,
        pendingOrders: 0,
        totalOrders: 0,
    });

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setError("");

            const [statsResponse, ordersResponse] = await Promise.all([
                fetch(`${API_URL}/api/admin/stats`),
                fetch(`${API_URL}/api/admin/orders`),
            ]);

            if (!statsResponse.ok || !ordersResponse.ok) {
                throw new Error("Failed to fetch admin data.");
            }

            const statsData = await statsResponse.json();
            const ordersData = await ordersResponse.json();

            setStats(statsData.stats);
            setOrders(ordersData.orders);
        } catch (error) {
            console.error("Admin dashboard error:", error);
            setError("Unable to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            setUpdatingOrder(orderId);

            const response = await fetch(
                `${API_URL}/api/admin/orders/${orderId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update status."
                );
            }

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.orderId === orderId
                        ? {
                            ...order,
                            status: status,
                        }
                        : order
                )
            );

            await fetchDashboard();
        } catch (error) {
            console.error("Status update error:", error);
            alert("Unable to update order status.");
        } finally {
            setUpdatingOrder(null);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}

            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <div>
                        <p className="text-sm font-semibold text-orange-500">
                            Campus Café
                        </p>

                        <h1 className="text-2xl font-extrabold text-gray-900">
                            Admin Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={fetchDashboard}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>

                        <button
                            onClick={() => {
                                window.location.href = "/";
                            }}
                            className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 font-semibold text-white transition hover:bg-gray-800"
                        >
                            <LogOut size={18} />
                            Customer Site
                        </button>

                    </div>
                </div>
            </header>

            {/* MAIN */}

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* TITLE */}

                <div className="mb-8">
                    <p className="font-semibold uppercase tracking-wider text-orange-500">
                        Overview
                    </p>

                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                        Café Management
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Manage orders and monitor today's café activity.
                    </p>
                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* STATS */}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">
                                    Today's Orders
                                </p>

                                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                                    {stats.todayOrders}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                                <ShoppingBag size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">
                                    Today's Income
                                </p>

                                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                                    ₹{stats.todayIncome}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <IndianRupee size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">
                                    Pending Orders
                                </p>

                                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                                    {stats.pendingOrders}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                                <Clock3 size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">
                                    Total Orders
                                </p>

                                <p className="mt-2 text-3xl font-extrabold text-gray-900">
                                    {stats.totalOrders}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <ClipboardList size={23} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* ORDERS */}

                <div className="mt-10 rounded-2xl border border-gray-100 bg-white shadow-sm">

                    <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Orders
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Orders received from the customer website.
                            </p>
                        </div>

                        <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-500">
                            {orders.length} Orders
                        </span>

                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <RefreshCw
                                size={28}
                                className="mx-auto animate-spin text-orange-500"
                            />

                            <p className="mt-4 text-gray-500">
                                Loading orders...
                            </p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBag
                                size={40}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 text-lg font-bold text-gray-900">
                                No orders yet
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Customer orders will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[950px]">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Order
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Table
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Items
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Total
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Time
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {orders.map((order) => (
                                        <tr
                                            key={order.orderId}
                                            className="transition hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-5">
                                                <p className="font-bold text-gray-900">
                                                    {order.orderId}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {order.customer.orderType}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-gray-900">
                                                    {order.customer.name}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {order.customer.phone}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">
                                                    {order.customer.tableNumber}
                                                </span>
                                            </td>

                                            <td className="max-w-xs px-6 py-5">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="text-sm text-gray-700"
                                                    >
                                                        {item.name} × {item.quantity}
                                                    </div>
                                                ))}
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-bold text-gray-900">
                                                    ₹{order.total}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <select
                                                    value={order.status}
                                                    disabled={
                                                        updatingOrder ===
                                                        order.orderId
                                                    }
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            order.orderId,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-orange-500 disabled:opacity-50"
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>

                                                    <option value="Confirmed">
                                                        Confirmed
                                                    </option>

                                                    <option value="Preparing">
                                                        Preparing
                                                    </option>

                                                    <option value="Ready">
                                                        Ready
                                                    </option>

                                                    <option value="Completed">
                                                        Completed
                                                    </option>
                                                </select>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </main>
        </div>
    );
}

export default AdminDashboard;