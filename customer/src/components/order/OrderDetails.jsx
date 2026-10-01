function OrderDetails({ order }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
                Order Details
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-gray-500">
                        Order ID
                    </p>
                    <p className="mt-1 font-bold text-gray-900">
                        {order.orderId}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Customer
                    </p>
                    <p className="mt-1 font-bold text-gray-900">
                        {order.customer.name}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Table Number
                    </p>
                    <p className="mt-1 font-bold text-gray-900">
                        {order.customer.tableNumber}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Order Type
                    </p>
                    <p className="mt-1 font-bold text-gray-900">
                        {order.customer.orderType}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;