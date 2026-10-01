import { Clock3, Heart, Wallet } from "lucide-react";

function WhyCampusCafe() {
    const features = [
        {
            icon: Heart,
            title: "Fresh Food",
            description:
                "Freshly prepared food made with quality ingredients for your campus cravings.",
        },
        {
            icon: Clock3,
            title: "Quick Service",
            description:
                "Simple ordering and fast preparation so you can get back to your day.",
        },
        {
            icon: Wallet,
            title: "Student Friendly",
            description:
                "Affordable meals and snacks designed to fit a student's budget.",
        },
    ];

    return (
        <section id="about" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">

                {/* Section Heading */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="font-semibold uppercase tracking-wider text-orange-500">
                        Why Campus Café?
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Good Food. Simple Experience.
                    </h2>

                    <p className="mt-4 text-gray-600">
                        Everything you need for a quick and enjoyable campus
                        food experience.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                                    <Icon size={28} />
                                </div>

                                <h3 className="mt-6 text-xl font-bold text-gray-900">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 leading-7 text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default WhyCampusCafe;