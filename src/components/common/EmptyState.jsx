export default function EmptyState({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
    </div>
  );
}