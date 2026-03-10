export const getMonthShort = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "short" });
};