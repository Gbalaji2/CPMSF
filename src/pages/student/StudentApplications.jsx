import { useEffect, useMemo, useState } from "react";
import { getMyApplications } from "../../services/applicationService";

export default function StudentApplications() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getMyApplications();
        setApplications(res.applications || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const counts = useMemo(() => {
    const total = applications.length;
    const submitted = applications.filter(
      (a) => a.status?.toLowerCase() === "submitted"
    ).length;
    const shortlisted = applications.filter(
      (a) => a.status?.toLowerCase() === "shortlisted"
    ).length;
    const rejected = applications.filter(
      (a) => a.status?.toLowerCase() === "rejected"
    ).length;
    const selected = applications.filter(
      (a) => a.status?.toLowerCase() === "selected"
    ).length;

    return { total, submitted, shortlisted, rejected, selected };
  }, [applications]);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();

    if (s === "shortlisted") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    if (s === "selected") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Applications</h2>
        <p className="text-gray-600 text-sm">
          Track your job applications and statuses.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card title="Total" value={counts.total} />
        <Card title="Submitted" value={counts.submitted} />
        <Card title="Shortlisted" value={counts.shortlisted} />
        <Card title="Rejected" value={counts.rejected} />
        <Card title="Selected" value={counts.selected} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="font-semibold text-lg mb-4">Applications</h3>

        {applications.length === 0 ? (
          <p className="text-gray-600 text-sm">No applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-2">Company</th>
                  <th className="py-3 px-2">Job Role</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Applied On</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">
                      {app.company?.name || "Company"}
                    </td>
                    <td className="py-3 px-2">{app.job?.title || "Job"}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {app.status || "submitted"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-sm text-gray-600">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}