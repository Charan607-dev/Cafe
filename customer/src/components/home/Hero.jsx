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

                {/* Burger Animation */}
                <div className="flex justify-center">
                    <div className="burger-circle">
                        <div className="burger">

                            {/* Bottom Bun */}
                            <div className="burger-part bottom-bun">
                                <div className="bun-bottom-shape"></div>
                            </div>

                            {/* Patty */}
                            <div className="burger-part patty">
                                <div className="patty-shape"></div>
                            </div>

                            {/* Cheese */}
                            <div className="burger-part cheese">
                                <div className="cheese-shape"></div>
                            </div>

                            {/* Lettuce */}
                            <div className="burger-part lettuce">
                                <div className="lettuce-shape"></div>
                            </div>

                            {/* Tomato */}
                            <div className="burger-part tomato">
                                <div className="tomato-shape"></div>
                            </div>

                            {/* Top Bun */}
                            <div className="burger-part top-bun">
                                <div className="bun-top-shape">
                                    <span className="sesame s1"></span>
                                    <span className="sesame s2"></span>
                                    <span className="sesame s3"></span>
                                    <span className="sesame s4"></span>
                                    <span className="sesame s5"></span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Hero;