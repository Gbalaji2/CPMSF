export const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};