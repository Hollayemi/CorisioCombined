export const statusOptions = [
    {
        label: "Pending",
        color: "orange",
        bg: "bg-orange-50",
        text: "!text-orange-700",
    },
    {
        label: "Paid",
        color: "green",
        bg: "bg-green-50",
        text: "!text-green-700",
    },
    {
        label: "Processing",
        color: "blue",
        bg: "bg-blue-50",
        text: "!text-blue-700",
    },
    {
        label: "Completed",
        color: "green",
        bg: "bg-green-50",
        text: "!text-green-700",
    },
    {
        label: "Pickable",
        color: "green",
        bg: "bg-green-50",
        text: "!text-green-700",
    },
    {
        label: "Cancelled",
        color: "red",
        bg: "bg-red-50",
        text: "!text-red-700",
    },
];

export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "paid":
            return {
                bg: "bg-emerald-50",
                text: "!text-emerald-700",
                border: "border-emerald-200",
            };
        case "processing":
            return {
                bg: "bg-blue-50",
                text: "!text-blue-700",
                border: "border-blue-200",
            };
        case "shipped":
            return {
                bg: "bg-purple-50",
                text: "!text-purple-700",
                border: "border-purple-200",
            };
        case "delivered":
            return {
                bg: "bg-green-50",
                text: "!text-green-700",
                border: "border-green-200",
            };
        case "cancelled":
            return {
                bg: "bg-red-50",
                text: "!text-red-700",
                border: "border-red-200",
            };
        default:
            return {
                bg: "bg-gray-50",
                text: "!text-gray-700",
                border: "border-gray-200",
            };
    }
};

export const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
        case "completed":
            return { bg: "bg-green-100", text: "!text-green-800" };
        case "processing":
            return { bg: "bg-blue-100", text: "!text-blue-800" };
        case "shipped":
            return { bg: "bg-purple-100", text: "!text-purple-800" };
        case "ready to ship":
            return { bg: "bg-orange-100", text: "!text-orange-800" };
        case "authentication":
            return { bg: "bg-yellow-100", text: "!text-yellow-800" };
        case "cancelled":
            return { bg: "bg-red-100", text: "!text-red-800" };
        default:
            return { bg: "bg-gray-100", text: "!text-gray-800" };
    }
};
export default function getStatus(status: string) {
    const result = statusOptions.find(
        (s) => s.label?.toLowerCase() === status?.toLowerCase()
    );
    return result || statusOptions[0];
}
