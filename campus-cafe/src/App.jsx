import { useState } from "react";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import WhyCampusCafe from "./components/home/WhyCampusCafe";
import MenuSection from "./components/menu/MenuSection";
import Stats from "./components/home/Stats";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import KineticGrid from "./components/ui/kinetic-grid";

import { useCart } from "./hooks/useCart";

function App() {
    const [cartOpen, setCartOpen] = useState(false);

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
        alert("🎉 Demo order placed successfully!");
        setCartOpen(false);
    };

    return (
        <KineticGrid globalColor="default" className="min-h-screen">
            <div className="relative min-h-screen text-gray-900">
                <Navbar
                    itemCount={itemCount}
                    onCartClick={() => setCartOpen(true)}
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
        </KineticGrid>
    );
}

export default App;