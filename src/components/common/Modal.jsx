export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow w-full max-w-lg p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-gray-100 text-sm"
          >
            X
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}