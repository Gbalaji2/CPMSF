export default function StatCard({ title, value, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-xs text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}