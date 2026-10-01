import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import CustomerDetails from "../components/checkout/CustomerDetails";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";

function Checkout({
    customerName = "",
    cart,
    total,
    onPlaceOrder,
    onBackToCart,
    placingOrder = false,
}) {
    const savedName = customerName || localStorage.getItem("customerName") || "";

    const [formData, setFormData] = useState({
        name: savedName,
        phone: "",
        tableNumber: "",
        orderType: "Pickup",
        deliveryLocation: "",
    });

    const handlePlaceOrder = () => {
        if (!formData.name.trim()) {
            alert("Please enter your name.");
            return;
        }

        if (!formData.tableNumber.trim()) {
            alert("Please enter your table number.");
            return;
        }

        onPlaceOrder(formData);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-10">

                <button
                    onClick={onBackToCart}
                    disabled={placingOrder}
                    className="mb-8 flex items-center gap-2 font-semibold text-gray-600 transition hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ArrowLeft size={20} />
                    Back to Cart
                </button>

                <div className="mb-10">
                    <p className="font-semibold uppercase tracking-wider text-orange-500">
                        Checkout
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Complete Your Order
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Enter your details and choose how you want to receive
                        your food.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">

                    <div className="space-y-8">
                        <CustomerDetails
                            formData={formData}
                            setFormData={setFormData}
                        />

                        <CheckoutForm
                            formData={formData}
                            setFormData={setFormData}
                            onPlaceOrder={handlePlaceOrder}
                            placingOrder={placingOrder}
                        />
                    </div>

                    <div>
                        <OrderSummary
                            cart={cart}
                            total={total}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Checkout;