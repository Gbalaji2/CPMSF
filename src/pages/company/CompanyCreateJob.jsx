import { useState } from "react";
import { createJob } from "../../services/jobService";
import { useNavigate } from "react-router-dom";

export default function CompanyCreateJob() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    minCgpa: "",
    location: "",
    salary: "",
    skills: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMsg("");

      const payload = {
        title: form.title,
        description: form.description,
        minCgpa: form.minCgpa,
        location: form.location,
        salary: form.salary,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await createJob(payload);
      setMsg("Job created successfully!");
      setTimeout(() => navigate("/company/jobs"), 800);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-5">
      <h1 className="text-xl font-bold">Post a New Job</h1>

      {msg && <p className="text-sm font-medium text-blue-600">{msg}</p>}

      <Input
        label="Job Title"
        value={form.title}
        onChange={(v) => setForm({ ...form, title: v })}
      />

      <div>
        <label className="text-sm text-gray-600">Job Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mt-2 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum CGPA"
          value={form.minCgpa}
          onChange={(v) => setForm({ ...form, minCgpa: v })}
        />
        <Input
          label="Location"
          value={form.location}
          onChange={(v) => setForm({ ...form, location: v })}
        />
        <Input
          label="Salary"
          value={form.salary}
          onChange={(v) => setForm({ ...form, salary: v })}
        />
        <Input
          label="Skills (comma separated)"
          value={form.skills}
          onChange={(v) => setForm({ ...form, skills: v })}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-5 py-2 rounded-xl bg-black text-white text-sm"
      >
        {loading ? "Posting..." : "Post Job"}
      </button>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}