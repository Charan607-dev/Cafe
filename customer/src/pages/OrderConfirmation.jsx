import OrderSuccess from "../components/order/OrderSuccess";

function OrderConfirmation({
    order,
    onBackToMenu,
}) {
    return (
        <OrderSuccess
            order={order}
            onBackToMenu={onBackToMenu}
        />
    );
}

export default OrderConfirmation;