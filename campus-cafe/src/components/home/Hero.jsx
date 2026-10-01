function Hero() {
    return (
        <section className="bg-orange-50">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 lg:py-28">

                {/* Left Content */}
                <div>
                    <p className="mb-4 font-semibold uppercase tracking-wider text-orange-500">
                        Your Campus. Your Café.
                    </p>

                    <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Hungry?
                        <br />
                        <span className="text-orange-500">
                            We've Got You Covered.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                        Fresh, tasty and affordable food made for students.
                        Discover your campus favorites and order with just a few clicks.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <a
                            href="#menu"
                            className="rounded-full bg-orange-500 px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600"
                        >
                            Explore Menu
                        </a>

                        <a
                            href="#about"
                            className="rounded-full border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="flex justify-center">
                    <div className="flex h-80 w-80 items-center justify-center rounded-full bg-orange-200 text-8xl shadow-xl sm:h-96 sm:w-96">
                        🍔
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Hero;