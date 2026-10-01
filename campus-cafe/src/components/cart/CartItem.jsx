import { Minus, Plus, Trash2 } from "lucide-react";

function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}) {
    return (
        <div className="flex gap-4 border-b border-gray-100 py-5">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-3xl">
                {item.emoji}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-gray-900">
                            {item.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                            ₹{item.price}
                        </p>
                    </div>

                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="mt-3 flex items-center gap-3">
                    <button
                        onClick={() => onDecrease(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100"
                    >
                        <Minus size={14} />
                    </button>

                    <span className="font-semibold">
                        {item.quantity}
                    </span>

                    <button
                        onClick={() => onIncrease(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100"
                    >
                        <Plus size={14} />
                    </button>

                    <span className="ml-auto font-bold">
                        ₹{item.price * item.quantity}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartItem;