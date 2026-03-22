import { useEffect, useState } from "react";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
} from "../../services/studentService";

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    cgpa: "",
    year: "",
    skills: "",
    phone: "",
    resumeUrl: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getStudentProfile();
      const s = res.student;

      setForm({
        name: s?.name || "",
        email: s?.email || "",
        department: s?.department || "",
        cgpa: s?.cgpa || "",
        year: s?.year || "",
        phone: s?.phone || "",
        skills: (s?.skills || []).join(", "),
        resumeUrl: s?.resumeUrl || "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const payload = {
        name: form.name,
        email: form.email,
        department: form.department,
        cgpa: Number(form.cgpa),
        year: form.year,
        phone: form.phone,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await updateStudentProfile(payload);

      setSuccess("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setSuccess("");
      setError("");

      const res = await uploadResume(file);

      setForm((prev) => ({
        ...prev,
        resumeUrl: res.resumeUrl,
      }));

      setSuccess("Resume uploaded successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Resume upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Profile</h2>
        <p className="text-gray-600 text-sm">
          Keep your details updated to apply for jobs and interviews.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm">
          {success}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          {/* Department */}
          <Input
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="CSE / IT / ECE..."
          />

          {/* Year */}
          <Input
            label="Year"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="3rd Year / Final Year"
          />

          {/* Phone */}
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="9876543210"
          />

          {/* CGPA */}
          <Input
            label="CGPA"
            name="cgpa"
            value={form.cgpa}
            onChange={handleChange}
            placeholder="7.5"
            type="number"
            step="0.01"
          />

          {/* Skills */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Skills (comma separated)
            </label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node, MongoDB, Tailwind"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
            />
          </div>

          {/* Resume */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Resume
            </label>

            <div className="mt-2 flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="text-sm"
              />

              <button
                type="button"
                disabled={uploading}
                className="px-4 py-2 rounded-xl border text-sm disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>

              {form.resumeUrl && (
                <a
                  href={form.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
      />
    </div>
  );
}