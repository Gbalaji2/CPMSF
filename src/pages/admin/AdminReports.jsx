import { useState } from "react";
import axios from "axios";

export default function AdminReports() {
  const [loading, setLoading] = useState("");

  const downloadReport = async (type, format) => {
    try {
      setLoading(`${type}-${format}`);

      const response = await axios.get(
        `/api/reports/${type}/${format}`,
        {
          responseType: "blob", // important for file download
        }
      );

      // Create file URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute(
        "download",
        `${type}-report.${format}`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download report.");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Reports</h2>
        <p className="text-sm text-gray-600">
          Export placement reports (PDF / CSV)
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Students Report */}
        <ReportCard
          title="Students Report"
          description="Export list of students, CGPA, skills, placed status."
          type="students"
          downloadReport={downloadReport}
          loading={loading}
        />

        {/* Drives Report */}
        <ReportCard
          title="Drives Report"
          description="Export placement drive stats, offers, participants."
          type="drives"
          downloadReport={downloadReport}
          loading={loading}
        />
      </div>

      {/* Backend Info */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="font-semibold mb-2">Required Backend Endpoints</h3>
        <p className="text-sm text-gray-600 font-mono text-xs">
          GET /api/reports/students/csv <br />
          GET /api/reports/students/pdf <br />
          GET /api/reports/drives/csv <br />
          GET /api/reports/drives/pdf
        </p>
      </div>
    </div>
  );
}

function ReportCard({ title, description, type, downloadReport, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-3">
      <h3 className="font-semibold">{title}</h3>

      <p className="text-sm text-gray-600">{description}</p>

      <div className="flex gap-3">
        <button
          onClick={() => downloadReport(type, "csv")}
          disabled={loading === `${type}-csv`}
          className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading === `${type}-csv` ? "Downloading..." : "Export CSV"}
        </button>

        <button
          onClick={() => downloadReport(type, "pdf")}
          disabled={loading === `${type}-pdf`}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {loading === `${type}-pdf` ? "Downloading..." : "Export PDF"}
        </button>
      </div>
    </div>
  );
}