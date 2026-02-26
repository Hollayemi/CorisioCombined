type IntervalType = "daily" | "weekly" | "monthly";

interface FormatChartLabelsOptions {
    labels: string[];
    interval: IntervalType;
}

export default function formatChartLabels({
    labels,
    interval,
}: FormatChartLabelsOptions): string[] {
    return labels.map((label) => {
        const [first, second] = label.split(".");

        switch (interval) {
            case "daily":
                // Format: "month.day" -> "Mon", "Tue", etc.
                const month = parseInt(first);
                const day = parseInt(second);

                // Create a date object for the current year (assuming current year context)
                // You might want to adjust this logic based on your specific needs
                const currentYear = new Date().getFullYear();
                const date = new Date(currentYear, month - 1, day);

                return date.toLocaleDateString("en-US", { weekday: "short" });

            case "weekly":
                // Format: "year.week" -> "Week 17", "Week 18", etc.
                const weekNumber = parseInt(second);
                return `WK ${weekNumber}`;

            case "monthly":
                // Format: "year.month" -> "Jan", "Feb", etc.
                const monthNumber = parseInt(second);
                const monthDate = new Date(2024, monthNumber - 1, 1); // Year doesn't matter for month name

                return monthDate.toLocaleDateString("en-US", {
                    month: "short",
                });

            default:
                return label; // Return original if interval type is not recognized
        }
    });
}

// Example usage:
const dailyLabels = [
    "6.9",
    "6.10",
    "6.11",
    "6.12",
    "6.13",
    "6.14",
    "6.15",
    "6.16",
];
const weeklyLabels = [
    "2025.17",
    "2025.18",
    "2025.19",
    "2025.20",
    "2025.21",
    "2025.22",
    "2025.23",
    "2025.24",
];
const monthlyLabels = [
    "2024.10",
    "2024.11",
    "2024.12",
    "2025.1",
    "2025.2",
    "2025.3",
    "2025.4",
    "2025.5",
    "2025.6",
];

console.log(
    "Daily:",
    formatChartLabels({ labels: dailyLabels, interval: "daily" })
);
// Output: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] (depends on actual dates)

console.log(
    "Weekly:",
    formatChartLabels({ labels: weeklyLabels, interval: "weekly" })
);
// Output: ['Week 17', 'Week 18', 'Week 19', 'Week 20', 'Week 21', 'Week 22', 'Week 23', 'Week 24']

console.log(
    "Monthly:",
    formatChartLabels({ labels: monthlyLabels, interval: "monthly" })
);
// Output: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

// Alternative version with full month names
function formatChartLabelsLong({
    labels,
    interval,
}: FormatChartLabelsOptions): string[] {
    return labels.map((label) => {
        const [first, second] = label.split(".");

        switch (interval) {
            case "daily":
                const month = parseInt(first);
                const day = parseInt(second);
                const currentYear = new Date().getFullYear();
                const date = new Date(currentYear, month - 1, day);

                return date.toLocaleDateString("en-US", { weekday: "long" }); // Full day name

            case "weekly":
                const weekNumber = parseInt(second);
                return `Week ${weekNumber}`;

            case "monthly":
                const monthNumber = parseInt(second);
                const monthDate = new Date(2024, monthNumber - 1, 1);

                return monthDate.toLocaleDateString("en-US", { month: "long" }); // Full month name

            default:
                return label;
        }
    });
}
