import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorBox from "../../components/common/ErrorBox";

import AdminTable from "../../components/admin/AdminTable";
import AdminFormModal from "../../components/admin/AdminFormModal";

import { getAllStudents } from "../../services/studentService";
import { getAllCompanies } from "../../services/companyService";
import {
  getAllInterviews,
  scheduleInterview,
  deleteInterview,
} from "../../services/interviewService";

export default function AdminInterviews() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    studentId: "",
    companyId: "",
    slot: "",
    format: "virtual",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [s, c, i] = await Promise.all([
        getAllStudents(),
        getAllCompanies(),
        getAllInterviews(),
      ]);

      setStudents(s.students || []);
      setCompanies(c.companies || []);
      setInterviews(i.interviews || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return interviews.filter((x) => {
      return (
        x.student?.name?.toLowerCase().includes(q) ||
        x.company?.name?.toLowerCase().includes(q) ||
        x.format?.toLowerCase().includes(q)
      );
    });
  }, [interviews, search]);

  const handleSchedule = async () => {
    try {
      const payload = {
        ...form,
        slot: new Date(form.slot),
      };

      await scheduleInterview(payload);
      setOpen(false);
      setForm({ studentId: "", companyId: "", slot: "", format: "virtual" });
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to schedule interview.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this interview?")) return;
    try {
      await deleteInterview(id);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete interview.");
    }
  };

  if (loading) return <Loader text="Loading interviews..." />;
  if (error) return <ErrorBox message={error} onBack={fetchData} backText="Retry" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Interviews</h2>
          <p className="text-sm text-gray-600">
            Schedule and manage interviews.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm"
        >
          + Schedule Interview
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student/company/format..."
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      </div>

      <AdminTable headers={["Student", "Company", "Slot", "Format", "Status", "Actions"]}>
        {filtered.map((i) => (
          <tr key={i._id}>
            <td className="px-4 py-3">{i.student?.name || "-"}</td>
            <td className="px-4 py-3">{i.company?.name || "-"}</td>
            <td className="px-4 py-3">
              {i.slot ? new Date(i.slot).toLocaleString() : "-"}
            </td>
            <td className="px-4 py-3">{i.format || "-"}</td>
            <td className="px-4 py-3">
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                {i.status || "scheduled"}
              </span>
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => handleDelete(i._id)}
                className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminFormModal
        open={open}
        onClose={() => setOpen(false)}
        title="Schedule Interview"
        onSubmit={handleSchedule}
        submitText="Schedule"
      >
        <select
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.email})
            </option>
          ))}
        </select>

        <select
          value={form.companyId}
          onChange={(e) => setForm({ ...form, companyId: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={form.slot}
          onChange={(e) => setForm({ ...form, slot: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />

        <select
          value={form.format}
          onChange={(e) => setForm({ ...form, format: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        >
          <option value="virtual">Virtual</option>
          <option value="in-person">In-Person</option>
        </select>
      </AdminFormModal>
    </div>
  );
}