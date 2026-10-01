import { ShoppingCart, Menu, X, LogOut, ClipboardList } from "lucide-react";
import { useState } from "react";

function Navbar({ itemCount = 0, onCartClick, onLogout, onMyOrdersClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                <a
                    href="#"
                    className="text-2xl font-bold text-orange-500"
                >
                    Campus<span className="text-gray-900">Café</span>
                </a>

                <div className="hidden items-center gap-8 md:flex">
                    <a href="#" className="font-medium text-gray-700 hover:text-orange-500">
                        Home
                    </a>

                    <a href="#menu" className="font-medium text-gray-700 hover:text-orange-500">
                        Menu
                    </a>

                    <a href="#about" className="font-medium text-gray-700 hover:text-orange-500">
                        About
                    </a>

                    <a href="#contact" className="font-medium text-gray-700 hover:text-orange-500">
                        Contact
                    </a>

                    <button
                        onClick={onMyOrdersClick}
                        className="flex items-center gap-1.5 font-medium text-gray-700 transition hover:text-orange-500"
                    >
                        <ClipboardList size={16} />
                        My Orders
                    </button>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 font-medium text-gray-700 transition hover:text-orange-500"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>

                <div className="flex items-center gap-4">

                    <button
                        onClick={onCartClick}
                        className="relative rounded-full p-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    >
                        <ShoppingCart size={22} />

                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                            {itemCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg p-2 text-gray-700 md:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>

                </div>
            </div>

            {mobileMenuOpen && (
                <div className="border-t px-6 py-4 md:hidden">
                    <div className="flex flex-col gap-4">
                        <a href="#">Home</a>
                        <a href="#menu">Menu</a>
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>

                        <button
                            onClick={onMyOrdersClick}
                            className="flex items-center gap-2 text-left font-medium text-gray-700 transition hover:text-orange-500"
                        >
                            <ClipboardList size={16} />
                            My Orders
                        </button>

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 text-left font-medium text-gray-700 transition hover:text-orange-500"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            )}

        </nav>
    );
}

export default Navbar;