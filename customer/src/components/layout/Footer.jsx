function Footer() {
    return (
        <footer id="contact" className="bg-gray-900 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">

                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-orange-500">
                        Campus<span className="text-white">Café</span>
                    </h2>

                    <p className="mt-4 max-w-sm leading-7 text-gray-400">
                        Fresh, affordable and delicious food made for campus life.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold text-white">
                        Quick Links
                    </h3>

                    <div className="mt-4 flex flex-col gap-3 text-gray-400">
                        <a href="#" className="hover:text-orange-400">
                            Home
                        </a>

                        <a href="#menu" className="hover:text-orange-400">
                            Menu
                        </a>

                        <a href="#about" className="hover:text-orange-400">
                            About
                        </a>

                        <a href="#contact" className="hover:text-orange-400">
                            Contact
                        </a>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold text-white">
                        Contact
                    </h3>

                    <div className="mt-4 space-y-3 text-gray-400">
                        <p>📍 Campus Food Court</p>
                        <p>📞 +91 XXXXX XXXXX</p>
                        <p>✉️ hello@campuscafe.demo</p>
                    </div>
                </div>

            </div>

            <div className="border-t border-gray-800 px-6 py-5 text-center text-sm text-gray-500">
                © 2026 Campus Café. Demo project.
            </div>
        </footer>
    );
}

export default Footer;