import { User, Hash } from "lucide-react";

function CustomerDetails({ formData, setFormData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
                Customer Details
            </h2>

            <div className="mt-6 space-y-5">
                {/* Name */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Customer Name
                    </label>

                    <div className="relative">
                        <User
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        />

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            readOnly
                            className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 font-semibold text-gray-900 outline-none"
                        />
                    </div>
                </div>

                {/* Table Number */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Table Number
                    </label>

                    <div className="relative">
                        <Hash
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            name="tableNumber"
                            value={formData.tableNumber}
                            onChange={handleChange}
                            placeholder="Example: T12"
                            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerDetails;