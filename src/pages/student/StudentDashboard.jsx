import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { getMyApplications } from "../../services/applicationService";
import { getMyInterviews } from "../../services/interviewService";
import { getStudentProfile } from "../../services/studentService";
import { getMonthShort } from "../../utils/monthName";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all at once
        const [studentRes, appRes, interviewRes] = await Promise.all([
          getStudentProfile(),
          getMyApplications(),
          getMyInterviews(),
        ]);

        setStudent(studentRes.student);
        setApplications(appRes.applications || []);
        setInterviews(interviewRes.interviews || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Summary calculations
  const summary = useMemo(() => {
    const total = applications.length;

    const shortlisted = applications.filter(
      (a) => a.status?.toLowerCase() === "shortlisted"
    ).length;

    const rejected = applications.filter(
      (a) => a.status?.toLowerCase() === "rejected"
    ).length;

    // upcoming interviews only (date in future)
    const now = new Date();
    const upcoming = interviews.filter((i) => {
      const slot = new Date(i.slot);
      return slot >= now && i.status?.toLowerCase() !== "cancelled";
    }).length;

    return {
      totalApplications: total,
      shortlisted,
      rejected,
      upcomingInterviews: upcoming,
    };
  }, [applications, interviews]);

  // Trend chart for last 6 months
  const applicationsTrend = useMemo(() => {
    // Build a map for last 6 months
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.toLocaleString("en-US", { month: "short" }),
        year: d.getFullYear(),
        count: 0,
      });
    }

    // Fill counts using createdAt
    applications.forEach((app) => {
      const createdAt = app.createdAt || app.appliedAt;
      if (!createdAt) return;

      const d = new Date(createdAt);
      const month = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();

      const found = months.find((m) => m.month === month && m.year === year);
      if (found) found.count += 1;
    });

    return months.map((m) => ({
      month: m.month,
      applications: m.count,
    }));
  }, [applications]);

  // Upcoming interviews sorted by date
  const upcomingInterviews = useMemo(() => {
    const now = new Date();

    return interviews
      .filter((i) => new Date(i.slot) >= now)
      .sort((a, b) => new Date(a.slot) - new Date(b.slot))
      .slice(0, 3);
  }, [interviews]);

  // Recent applications sorted
  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [applications]);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();

    if (s === "shortlisted") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    if (s === "submitted") return "bg-gray-100 text-gray-700";
    if (s === "selected") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-2">Dashboard</h2>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome{student?.name ? `, ${student.name}` : ""} 👋
          </h2>
          <p className="text-gray-600 text-sm">
            Track your placement progress and upcoming interviews.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-black text-white text-sm">
            View Jobs
          </button>
          <button className="px-4 py-2 rounded-xl border text-sm">
            My Applications
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Applications" value={summary.totalApplications} />
        <Card title="Shortlisted" value={summary.shortlisted} />
        <Card title="Rejected" value={summary.rejected} />
        <Card title="Upcoming Interviews" value={summary.upcomingInterviews} />
      </div>

      {/* Chart + Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-5">
          <h3 className="font-semibold text-lg mb-4">
            Applications Trend (Last 6 Months)
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="applications" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-semibold text-lg mb-4">Upcoming Interviews</h3>

          {upcomingInterviews.length === 0 ? (
            <p className="text-sm text-gray-600">
              No interviews scheduled yet.
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingInterviews.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-2xl p-4 hover:bg-gray-50 transition"
                >
                  <p className="font-semibold">
                    {item.company?.name || "Company"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.job?.title || "Interview"}
                  </p>

                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(item.slot).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {new Date(item.slot).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Mode:</span>{" "}
                      {item.format || "Virtual"}
                    </p>
                  </div>

                  <button className="mt-3 w-full py-2 rounded-xl bg-black text-white text-sm">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Applications</h3>
          <button className="text-sm font-medium underline">View All</button>
        </div>

        {recentApplications.length === 0 ? (
          <p className="text-sm text-gray-600">
            You haven’t applied to any jobs yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-2">Company</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Applied On</th>
                </tr>
              </thead>

              <tbody>
                {recentApplications.map((app) => (
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
                        {app.status || "Submitted"}
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