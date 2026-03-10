import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorBox from "../../components/common/ErrorBox";

import AdminTable from "../../components/admin/AdminTable";
import AdminFormModal from "../../components/admin/AdminFormModal";

import {
  getAllDrives,
  createDrive,
  updateDrive,
  deleteDrive,
} from "../../services/driveService";

export default function AdminDrives() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drives, setDrives] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    date: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllDrives();
      setDrives(res.drives || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load drives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return drives.filter((d) => d.name?.toLowerCase().includes(q));
  }, [drives, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", date: "", description: "" });
    setOpen(true);
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({
      name: d.name || "",
      date: d.date ? d.date.slice(0, 10) : "",
      description: d.description || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        date: new Date(form.date),
      };

      if (editing) await updateDrive(editing._id, payload);
      else await createDrive(payload);

      setOpen(false);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save drive.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this drive?")) return;
    try {
      await deleteDrive(id);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete drive.");
    }
  };

  if (loading) return <Loader text="Loading drives..." />;
  if (error) return <ErrorBox message={error} onBack={fetchData} backText="Retry" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Drives</h2>
          <p className="text-sm text-gray-600">
            Manage placement drives and events.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm"
        >
          + Create Drive
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search drive by name..."
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />
      </div>

      <AdminTable headers={["Drive Name", "Date", "Description", "Actions"]}>
        {filtered.map((d) => (
          <tr key={d._id}>
            <td className="px-4 py-3 font-medium">{d.name}</td>
            <td className="px-4 py-3">
              {d.date ? new Date(d.date).toDateString() : "-"}
            </td>
            <td className="px-4 py-3">{d.description || "-"}</td>
            <td className="px-4 py-3 flex gap-2">
              <button
                onClick={() => openEdit(d)}
                className="px-3 py-1 rounded-lg border text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(d._id)}
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
        title={editing ? "Edit Drive" : "Create Drive"}
        onSubmit={handleSave}
        submitText={editing ? "Update" : "Create"}
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Drive Name"
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full rounded-xl border px-3 py-2 text-sm"
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full rounded-xl border px-3 py-2 text-sm"
          rows={4}
        />
      </AdminFormModal>
    </div>
  );
}