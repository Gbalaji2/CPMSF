export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow p-6 max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">Unauthorized</h2>
        <p className="text-gray-600">
          You don’t have permission to access this page.
        </p>
      </div>
    </div>
  );
}