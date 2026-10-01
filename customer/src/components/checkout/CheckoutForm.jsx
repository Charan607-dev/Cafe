import { ShoppingBag, LoaderCircle } from "lucide-react";

function CheckoutForm({
    formData,
    setFormData,
    onPlaceOrder,
    placingOrder = false,
}) {
    const handleOrderTypeChange = () => {
        if (placingOrder) return;

        setFormData((current) => ({
            ...current,
            orderType: "Pickup",
            deliveryLocation: "",
        }));
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
                Order Type
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                Choose how you want to receive your order.
            </p>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={handleOrderTypeChange}
                    disabled={placingOrder}
                    className="w-full rounded-xl border border-orange-500 bg-orange-50 p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <ShoppingBag
                        size={25}
                        className="text-orange-500"
                    />

                    <h3 className="mt-3 font-bold text-gray-900">
                        Pickup
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Collect your order from the campus café.
                    </p>
                </button>
            </div>

            <button
                type="button"
                onClick={onPlaceOrder}
                disabled={placingOrder}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-base font-bold text-white shadow-lg transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
                {placingOrder ? (
                    <>
                        <LoaderCircle
                            size={20}
                            className="animate-spin"
                        />
                        Placing Order...
                    </>
                ) : (
                    "Place Order"
                )}
            </button>

        </div>
    );
}

export default CheckoutForm;