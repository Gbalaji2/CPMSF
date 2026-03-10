import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../../services/companyService";

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    website: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getCompanyProfile();
      setForm({
        name: data.name || "",
        contactEmail: data.contactEmail || "",
        phone: data.phone || "",
        website: data.website || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMsg("");
      await updateCompanyProfile(form);
      setMsg("Company profile updated successfully!");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading profile..." />;

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-5">
      <h1 className="text-xl font-bold">Company Profile</h1>

      {msg && <p className="text-sm font-medium text-blue-600">{msg}</p>}

      <Input
        label="Company Name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
      />
      <Input
        label="Contact Email"
        value={form.contactEmail}
        onChange={(v) => setForm({ ...form, contactEmail: v })}
      />
      <Input
        label="Phone"
        value={form.phone}
        onChange={(v) => setForm({ ...form, phone: v })}
      />
      <Input
        label="Website"
        value={form.website}
        onChange={(v) => setForm({ ...form, website: v })}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2 rounded-xl bg-black text-white text-sm"
      >
        {saving ? "Saving..." : "Save Changes"}
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