import { useState, useEffect } from "react";
import {
    Calendar,
    IndianRupee,
    ShoppingBag,
    CheckCircle2,
    RefreshCw,
    Search,
    ChevronDown,
    ChevronUp,
    Filter,
} from "lucide-react";

// Format date into IST string: "01 Oct 2026"
export function formatISTDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr.endsWith("Z") ? dateStr : `${dateStr.replace(" ", "T")}Z`);
    return d.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// Format full datetime into IST string: "01 Oct 2026, 08:15 PM"
export function formatISTDateTime(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr.endsWith("Z") ? dateStr : `${dateStr.replace(" ", "T")}Z`);
    return d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

// Get YYYY-MM-DD in IST
export function getISTDateKey(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr.endsWith("Z") ? dateStr : `${dateStr.replace(" ", "T")}Z`);
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(d);

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    return `${year}-${month}-${day}`;
}

// Today's IST YYYY-MM-DD
export function getTodayIST() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    return `${year}-${month}-${day}`;
}

const STATUS_BADGES = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Preparing: "bg-purple-100 text-purple-700",
    Ready: "bg-emerald-100 text-emerald-700",
    Completed: "bg-green-100 text-green-700",
};

function OrderHistory({ apiUrl, allOrders = [] }) {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(`${apiUrl}/api/admin/history`);
            if (!response.ok) {
                throw new Error("Failed to load historical financial data.");
            }
            const data = await response.json();
            setHistoryData(data.dailySummary || []);
        } catch (err) {
            console.error("Fetch history error:", err);
            setError("Unable to load order history summary.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [apiUrl]);

    // Format YYYY-MM-DD into "01 Oct 2026"
    const formatDayLabel = (dateStr) => {
        if (!dateStr) return "—";
        const [year, month, day] = dateStr.split("-").map(Number);
        const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Filter historical orders
    const filteredOrders = allOrders.filter((order) => {
        const orderDateKey = getISTDateKey(order.createdAt);

        if (selectedDate !== "all" && orderDateKey !== selectedDate) {
            return false;
        }

        if (statusFilter !== "all" && order.status !== statusFilter) {
            return false;
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesId = order.orderId?.toLowerCase().includes(q);
            const matchesCustomer = order.customer?.name?.toLowerCase().includes(q);
            const matchesItem = order.items?.some((item) =>
                item.name?.toLowerCase().includes(q)
            );
            return matchesId || matchesCustomer || matchesItem;
        }

        return true;
    });

    // Total income from history data
    const totalHistoricalIncome = historyData.reduce(
        (sum, row) => sum + (row.income || 0),
        0
    );
    const totalHistoricalOrders = historyData.reduce(
        (sum, row) => sum + (row.orders || 0),
        0
    );
    const totalHistoricalCompleted = historyData.reduce(
        (sum, row) => sum + (row.completed || 0),
        0
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Order & Financial History
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Track historical orders, past income, and daily performance in IST (Asia/Kolkata).
                    </p>
                </div>

                <button
                    onClick={fetchHistory}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
                >
                    <RefreshCw size={16} />
                    Refresh History
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Historical Summary Stats Cards */}
            <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-500">
                                All-Time Income
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-gray-900">
                                ₹{totalHistoricalIncome.toLocaleString("en-IN")}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                From completed orders
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <IndianRupee size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-500">
                                Total Orders Recorded
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-gray-900">
                                {totalHistoricalOrders}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                Across all dates
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <ShoppingBag size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-500">
                                Total Completed Orders
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-gray-900">
                                {totalHistoricalCompleted}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                Successfully delivered
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <CheckCircle2 size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 1: Daily Income & Performance Summary Table */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Daily Performance & Income Summary
                        </h3>
                        <p className="text-xs text-gray-500">
                            Historical breakdown by date in Indian Standard Time (IST).
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Filter by Date:</span>
                        <select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-500"
                        >
                            <option value="all">All Dates ({historyData.length} days)</option>
                            {historyData.map((row) => (
                                <option key={row.date} value={row.date}>
                                    {formatDayLabel(row.date)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Date (IST)</th>
                                <th className="px-6 py-4 text-center">Total Orders</th>
                                <th className="px-6 py-4 text-center">Completed Orders</th>
                                <th className="px-6 py-4 text-right">Day's Income</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {historyData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                                        No historical records found.
                                    </td>
                                </tr>
                            ) : (
                                historyData.map((row) => {
                                    const isSelected = selectedDate === row.date;
                                    return (
                                        <tr
                                            key={row.date}
                                            className={`transition hover:bg-gray-50 ${isSelected ? "bg-orange-50/60 font-medium" : ""}`}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={15} className="text-orange-500" />
                                                    <span>{formatDayLabel(row.date)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-semibold text-gray-700">
                                                {row.orders}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                                                    {row.completed}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right font-extrabold text-orange-600">
                                                ₹{row.income.toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        setSelectedDate(isSelected ? "all" : row.date)
                                                    }
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                        isSelected
                                                            ? "bg-orange-500 text-white"
                                                            : "border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500"
                                                    }`}
                                                >
                                                    {isSelected ? "Show All Dates" : "View Orders"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECTION 2: Historical Orders List */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Orders Record
                            {selectedDate !== "all" && (
                                <span className="ml-2 text-sm font-normal text-orange-600">
                                    — filtered for {formatDayLabel(selectedDate)}
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-gray-500">
                            Viewing {filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search ID, customer, item..."
                                className="rounded-xl border border-gray-200 py-1.5 pl-9 pr-3 text-xs outline-none focus:border-orange-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Completed">Completed</option>
                            <option value="Ready">Ready</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending">Pending</option>
                        </select>

                        {selectedDate !== "all" && (
                            <button
                                onClick={() => setSelectedDate("all")}
                                className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                            >
                                Clear Date Filter
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date & Time (IST)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                                        No orders found matching your filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const isExpanded = expandedOrder === order.orderId;
                                    const badgeClass =
                                        STATUS_BADGES[order.status] || "bg-gray-100 text-gray-600";

                                    return (
                                        <tr key={order.orderId} className="transition hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">
                                                <div>
                                                    <span>{order.orderId}</span>
                                                    <p className="text-xs font-normal text-gray-400">
                                                        {order.customer?.orderType || "Dine In"} • Table {order.customer?.tableNumber || "—"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">
                                                    {order.customer?.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {order.customer?.phone}
                                                </p>
                                            </td>

                                            <td className="max-w-xs px-6 py-4">
                                                <div className="space-y-1">
                                                    {order.items?.slice(0, 2).map((item, idx) => (
                                                        <div key={idx} className="text-xs text-gray-700">
                                                            {item.name} × {item.quantity}
                                                        </div>
                                                    ))}
                                                    {order.items?.length > 2 && (
                                                        <span className="text-xs font-semibold text-orange-500">
                                                            +{order.items.length - 2} more items
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">
                                                ₹{order.total}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-600">
                                                {formatISTDateTime(order.createdAt)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;
