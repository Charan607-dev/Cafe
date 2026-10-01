function Stats() {
    const stats = [
        {
            number: "500+",
            label: "Students Served",
        },
        {
            number: "20+",
            label: "Food Items",
        },
        {
            number: "15 min",
            label: "Average Preparation",
        },
        {
            number: "4.8/5",
            label: "Student Rating",
        },
    ];

    return (
        <section className="bg-orange-500 py-16">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="text-center text-white"
                    >
                        <p className="text-3xl font-extrabold sm:text-4xl">
                            {stat.number}
                        </p>

                        <p className="mt-2 text-sm font-medium text-orange-100 sm:text-base">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Stats;