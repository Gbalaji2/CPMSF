export default function formatCurrency(
  amount,
  locale = "en-IN",
  currency = "INR"
) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₹0";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}