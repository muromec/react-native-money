export function format(n, f) {
    const x = f ? n : Math.round(n);
    return x.toLocaleString({
        style: 'currency',
        minimumFractionDigits: f || 0,
        maximumFractionDigits: f || 0,
    });
}

export function formatCurrency(currency, n, f) {
    const symbol = {UAH: '₴', USD: '$', EUR: '€'}[currency] || currency;
    return `${format(n, f)}${symbol}`;
}
