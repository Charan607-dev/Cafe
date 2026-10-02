import { useState } from "react";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import WhyCampusCafe from "./components/home/WhyCampusCafe";
import MenuSection from "./components/menu/MenuSection";
import Stats from "./components/home/Stats";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";

import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Welcome from "./pages/Welcome";
import MyOrders from "./pages/MyOrders";

import { useCart } from "./hooks/useCart";
import { API_BASE_URL } from "./config/api";

function generateCustomerId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `cust_${timestamp}_${random}`;
}

function CustomerApp() {
    const [customerName, setCustomerName] = useState(() => {
        return localStorage.getItem("customerName") || "";
    });

    // Ensure customerId exists for already-logged-in users (pre-Stage 4 fix)
    useState(() => {
        const name = localStorage.getItem("customerName");
        if (name && !localStorage.getItem("customerId")) {
            const newCustomerId = generateCustomerId();
            localStorage.setItem("customerId", newCustomerId);
        }
    });

    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [myOrdersOpen, setMyOrdersOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);

    const {
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        total,
        itemCount,
    } = useCart();

    const handleCheckout = () => {
        setCartOpen(false);
        setCheckoutOpen(true);
    };

    const handleBackToCart = () => {
        setCheckoutOpen(false);
        setCartOpen(true);
    };

    const generateOrderId = () => {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const randomNumber = Math.floor(1000 + Math.random() * 9000);

        return `CC-${year}${month}${day}-${randomNumber}`;
    };

    const handlePlaceOrder = async (customerDetails) => {
        if (placingOrder) {
            return;
        }

        setPlacingOrder(true);

        const customerId = localStorage.getItem("customerId") || "";

        const newOrder = {
            orderId: generateOrderId(),

            customerId,

            customer: customerDetails,

            items: cart.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                emoji: item.emoji || "",
            })),

            total,

            status: "Pending",

            preparationTime: "15–20 minutes",

            createdAt: new Date().toISOString(),
        };

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newOrder),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to place order."
                );
            }

            setOrder(data.order);
            setCheckoutOpen(false);
        } catch (error) {
            console.error("Place order error:", error);

            alert(
                "Unable to place the order right now. Please try again."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleLogin = (name) => {
        localStorage.setItem("customerName", name);
        setCustomerName(name);

        // Generate customer ID only if one doesn't already exist
        if (!localStorage.getItem("customerId")) {
            const newCustomerId = generateCustomerId();
            localStorage.setItem("customerId", newCustomerId);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("customerName");
        setCustomerName("");
        // Do NOT remove customerId — preserve order history
    };

    if (!customerName) {
        return <Welcome onLogin={handleLogin} />;
    }

    const handleBackToMenu = () => {
        setOrder(null);
        setMyOrdersOpen(false);
    };

    if (myOrdersOpen) {
        const customerId = localStorage.getItem("customerId") || "";
        return (
            <MyOrders
                customerId={customerId}
                onBackToMenu={handleBackToMenu}
            />
        );
    }

    if (order) {
        return (
            <OrderConfirmation
                order={order}
                onBackToMenu={handleBackToMenu}
            />
        );
    }

    if (checkoutOpen) {
        return (
            <Checkout
                customerName={customerName}
                cart={cart}
                total={total}
                onPlaceOrder={handlePlaceOrder}
                onBackToCart={handleBackToCart}
                placingOrder={placingOrder}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar
                itemCount={itemCount}
                onCartClick={() => setCartOpen(true)}
                onLogout={handleLogout}
                onMyOrdersClick={() => setMyOrdersOpen(true)}
            />

            <main>
                <Hero />

                <WhyCampusCafe />

                <MenuSection
                    onAddToCart={addToCart}
                    cart={cart}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                />

                <Stats />
            </main>

            <Footer />

            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                total={total}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
                onCheckout={handleCheckout}
            />
        </div>
    );
}

function App() {
    return <CustomerApp />;
}

export default App;