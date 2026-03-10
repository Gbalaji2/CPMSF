import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorBox from "../../components/common/ErrorBox";

import AdminTable from "../../components/admin/AdminTable";
import AdminFormModal from "../../components/admin/AdminFormModal";

import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../services/studentService";

export default function AdminStudents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    cgpa: "",
    department: "",
    skills: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllStudents();
      setStudents(res.students || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q)
      );
    });
  }, [students, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", cgpa: "", department: "", skills: "" });
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name || "",
      email: s.email || "",
      cgpa: s.cgpa || "",
      department: s.department || "",
      skills: (s.skills || []).join(", "),
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        cgpa: Number(form.cgpa),
        skills: form.skills
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };

      if (editing) await updateStudent(editing._id, payload);
      else await createStudent(payload);

      setOpen(false);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save student.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;

    try {
      await deleteStudent(id);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete student.");
    }
  };

  if (loading) return <Loader text="Loading students..." />;
  if (error) return <ErrorBox message={error} onBack={fetchData} backText="Retry" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Students</h2>
          <p className="text-sm text-gray-600">Manage student records.</p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm"
        >
          + Add Student
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, department..."
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      </div>

      <AdminTable
        headers={["Name", "Email", "CGPA", "Department", "Skills", "Actions"]}
      >
        {filtered.map((s) => (
          <tr key={s._id}>
            <td className="px-4 py-3">{s.name}</td>
            <td className="px-4 py-3">{s.email}</td>
            <td className="px-4 py-3">{s.cgpa || "-"}</td>
            <td className="px-4 py-3">{s.department || "-"}</td>
            <td className="px-4 py-3">
              {(s.skills || []).slice(0, 3).join(", ") || "-"}
            </td>
            <td className="px-4 py-3 flex gap-2">
              <button
                onClick={() => openEdit(s)}
                className="px-3 py-1 rounded-lg border text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
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
        title={editing ? "Edit Student" : "Add Student"}
        onSubmit={handleSave}
        submitText={editing ? "Update" : "Create"}
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Student Name"
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
        <input
          value={form.cgpa}
          onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
          placeholder="CGPA"
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
        <input
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          placeholder="Department"
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
        <input
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          placeholder="Skills (comma separated)"
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      </AdminFormModal>
    </div>
  );
}