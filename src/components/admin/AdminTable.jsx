export default function AdminTable({ headers = [], children }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">{children}</tbody>
        </table>
      </div>
    </div>
  );
}