function CartSummary({ total, onCheckout }) {
    return (
        <div className="border-t border-gray-200 pt-5">

            <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total}</span>
            </div>

            <button
                onClick={onCheckout}
                className="mt-5 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
            >
                Place Demo Order
            </button>
        </div>
    );
}

export default CartSummary;