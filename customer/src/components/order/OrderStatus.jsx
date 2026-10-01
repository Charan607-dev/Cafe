function OrderStatus({ order }) {
    return (
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-2xl text-white">
                    ⏱
                </div>

                <div>
                    <p className="text-sm font-semibold text-orange-600">
                        Estimated Preparation Time
                    </p>

                    <p className="mt-1 text-xl font-extrabold text-gray-900">
                        {order.preparationTime}
                    </p>
                </div>
            </div>

            <div className="mt-5 rounded-xl bg-white p-4">
                <p className="text-sm text-gray-500">
                    Current Status
                </p>

                <p className="mt-1 font-bold text-orange-500">
                    {order.status}
                </p>
            </div>
        </div>
    );
}

export default OrderStatus;