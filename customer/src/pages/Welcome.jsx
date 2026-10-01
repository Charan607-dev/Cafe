import { useState } from "react";
import { User, ArrowRight } from "lucide-react";

function Welcome({ onLogin }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            alert("Please enter your name to continue.");
            return;
        }
        onLogin(trimmed);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                    ☕
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-orange-500">
                    Welcome to Campus Café
                </p>

                <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    Hungry? Let's Eat!
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Please enter your name to browse our menu and start ordering.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 text-left">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Your Name
                        </label>

                        <div className="relative">
                            <User
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                autoFocus
                                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg transition hover:bg-orange-600"
                    >
                        <span>Continue</span>
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Welcome;
