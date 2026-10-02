import { LoaderCircle } from "lucide-react";

function CheckoutForm({
    onPlaceOrder,
    placingOrder = false,
}) {
    return (
        <button
            type="button"
            onClick={onPlaceOrder}
            disabled={placingOrder}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-base font-bold text-white shadow-lg transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
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
    );
}

export default CheckoutForm;