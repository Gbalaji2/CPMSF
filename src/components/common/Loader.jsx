export default function Loader({ text = "Loading..." }) {
  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-black animate-spin" />
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}