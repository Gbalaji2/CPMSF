export default function Notifications({ notifications }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 w-80 space-y-3 z-50">
      {notifications.slice(0, 4).map((n, idx) => (
        <div
          key={idx}
          className="bg-white shadow rounded-2xl p-4 border"
        >
          <p className="font-semibold text-sm">{n.title || "Notification"}</p>
          <p className="text-xs text-gray-600 mt-1">{n.message}</p>
        </div>
      ))}
    </div>
  );
}