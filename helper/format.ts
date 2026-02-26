const formatCurrency = (amount: string | number) => {
    return `₦ ${parseFloat(amount?.toString()).toLocaleString() || 0}`;
};

export default formatCurrency;

export const formatNumber = (amount: string | number) => {
    return `${parseFloat(amount?.toString()).toLocaleString() || 0}`;
};
