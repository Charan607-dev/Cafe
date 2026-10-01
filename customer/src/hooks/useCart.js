import { useState } from "react";

export function useCart() {
    const [cart, setCart] = useState([]);

    const addToCart = (food) => {
        setCart((current) => {
            const existing = current.find((item) => item.id === food.id);

            if (existing) {
                return current.map((item) =>
                    item.id === food.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...current, { ...food, quantity: 1 }];
        });
    };

    const increaseQuantity = (id) => {
        setCart((current) =>
            current.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCart((current) =>
            current
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCart((current) =>
            current.filter((item) => item.id !== id)
        );
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const itemCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return {
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        total,
        itemCount,
    };
}