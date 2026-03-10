export default function ErrorBox({ message, onBack, backText = "Back" }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-red-600 text-sm">{message}</p>

      {onBack && (
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-black text-white text-sm"
        >
          {backText}
        </button>
      )}
    </div>
  );
}