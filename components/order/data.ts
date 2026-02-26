export const orderStatusMessages: any = {
    unpaid: {
        title: "New Order Confirmed",
        note: "The order has been successfully confirmed by our system",
    },
    paid: {
        title: "Order Paid",
        note: "Your order payment has been received, You will receive feedback from the store very soon.",
    },
    processing: {
        title: "Order Processing",
        note: "We're currently processing your order. Sit tight, we'll get it ready for you soon.",
    },
    out_for_delivery: {
        title: "Out for Delivery",
        note: "Your order is out for delivery. Expect your items to arrive shortly!",
    },
    pickable: {
        title: "Ready for pick-up",
        note: "Your order is ready for pick-up. Come as the picker or send the picker to get the product(s).",
    },
    completed: {
        title: "Order Completed",
        note: "Congratulations! Your order has been successfully delivered and completed. Enjoy your products!",
    },
    return: {
        title: "Return Order",
        note: "Congratulations! Your order has been successfully delivered and completed. Enjoy your products!",
    },
    review: {
        title: "Order Review",
        note: "Your order is now completed. Please take a moment to share your feedback and review your experience.",
    },
    re_order: {
        title: "Re Order",
        note: "Your order payment has been received, You will receive feedback from the store very soon.",
    },
    cancelled: {
        title: "Order Cancelled",
        note: "We're sorry to inform you that your order has been cancelled. Please contact support for further assistance.",
    },
    refunded: {
        title: "Order Refunded",
        note: "Your order has been refunded successfully. Please allow some time for the amount to reflect in your account.",
    },
    pending: {
        title: "Order Pending",
        note: "Your order is currently pending processing. We'll update you once it's on its way!",
    },
};

export const nextSteps: any = {
    pending: ["Paid", "Processing", "Out for delivery", "Completed", "Review"],
    re_order: ["Paid", "Processing", "Out for delivery", "Completed", "Review"],
    unpaid: ["Paid", "Processing", "Out for delivery", "Completed", "Review"],
    paid: ["Processing", "out for delivery", "Completed", "Review"],
    processing: ["Out for delivery", "Completed", "Review"],
    out_for_delivery: ["Completed", "Review"],
    pickable: ["Completed", "Review"],
    completed: ["Review", "Re order"],
    review: ["Re order"],
    return: ["Refunded", "Completed"],
    refunded: ["Completed"],
    cancelled: ["Re order"],
};
