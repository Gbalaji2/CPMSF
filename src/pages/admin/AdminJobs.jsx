import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorBox from "../../components/common/ErrorBox";
import AdminTable from "../../components/admin/AdminTable";

import { getAllJobs, deleteJob } from "../../services/jobService";

export default function AdminJobs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllJobs();
      setJobs(res.jobs || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter((j) => {
      return (
        j.title?.toLowerCase().includes(q) ||
        j.company?.name?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)
      );
    });
  }, [jobs, search]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await deleteJob(id);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete job.");
    }
  };

  if (loading) return <Loader text="Loading jobs..." />;
  if (error) return <ErrorBox message={error} onBack={fetchData} backText="Retry" />;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Jobs</h2>
        <p className="text-sm text-gray-600">View and manage all jobs.</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job title, company, location..."
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      </div>

      <AdminTable headers={["Title", "Company", "Type", "CTC", "Location", "Actions"]}>
        {filtered.map((j) => (
          <tr key={j._id}>
            <td className="px-4 py-3 font-medium">{j.title}</td>
            <td className="px-4 py-3">{j.company?.name || "-"}</td>
            <td className="px-4 py-3">{j.jobType || "-"}</td>
            <td className="px-4 py-3">{j.ctc ? `${j.ctc} LPA` : "-"}</td>
            <td className="px-4 py-3">{j.location || "-"}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => handleDelete(j._id)}
                className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}