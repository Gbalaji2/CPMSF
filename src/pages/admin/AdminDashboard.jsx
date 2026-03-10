import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorBox from "../../components/common/ErrorBox";

import {
  getAdminStats,
  getAllStudents,
  getAllCompanies,
  getAllJobsAdmin,
  getAllDrivesAdmin,
  approveCompany,
  rejectCompany,
} from "../../services/adminService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [drives, setDrives] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [adminRes, s, c, j, d] = await Promise.all([
        getAdminStats(),
        getAllStudents(),
        getAllCompanies(),
        getAllJobsAdmin(),
        getAllDrivesAdmin(),
      ]);

      setStats(adminRes?.stats || adminRes);
      setStudents(s.students || []);
      setCompanies(c.companies || []);
      setJobs(j.jobs || []);
      setDrives(d.drives || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    await approveCompany(id);
    fetchData();
  };

  const handleReject = async (id) => {
    await rejectCompany(id);
    fetchData();
  };

  if (loading) return <Loader text="Loading admin dashboard..." />;
  if (error) return <ErrorBox message={error} onBack={fetchData} backText="Retry" />;

  /* Placement Rate */
  const placedStudents = students.filter(
    (s) => s.placementStatus === "placed"
  ).length;

  const placementRate = students.length
    ? Math.round((placedStudents / students.length) * 100)
    : 0;

  const summaryChartData = [
    { name: "Students", count: students.length },
    { name: "Companies", count: companies.length },
    { name: "Jobs", count: jobs.length },
    { name: "Drives", count: drives.length },
  ];

  const pendingCompanies = companies.filter((c) => !c.isApproved);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-sm text-gray-600">
          Complete overview of placement management system.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="Total Students" value={students.length} />
        <StatCard title="Total Companies" value={companies.length} />
        <StatCard title="Total Jobs" value={jobs.length} />
        <StatCard title="Placement Drives" value={drives.length} />
        <StatCard title="Placement Rate" value={`${placementRate}%`} />
      </div>

      {/* Admin Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Applications" value={stats.totalApplications} />
          <StatCard title="Active Jobs" value={stats.totalJobs} />
          <StatCard title="Registered Students" value={stats.totalStudents} />
          <StatCard title="Registered Companies" value={stats.totalCompanies} />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Applications Per Month */}
        {stats?.applicationsPerMonth && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">Applications per Month</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.applicationsPerMonth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Placement Trend */}
        {stats?.placementTrend && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">Placed vs Not Placed</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.placementTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="placed" />
                  <Line dataKey="notPlaced" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* System Summary */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold mb-4">System Summary</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold mb-4">Recent Job Postings</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Company</th>
              <th>Role</th>
              <th>Location</th>
              <th>Salary</th>
            </tr>
          </thead>

          <tbody>
            {jobs.slice(0, 5).map((job) => (
              <tr key={job._id} className="border-b">
                <td className="py-2">{job.company?.name}</td>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Company Approvals */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold mb-4">Pending Company Approvals</h3>

        {pendingCompanies.length === 0 && (
          <p className="text-gray-500 text-sm">No pending approvals.</p>
        )}

        {pendingCompanies.slice(0, 5).map((company) => (
          <div
            key={company._id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-medium">{company.name}</p>
              <p className="text-xs text-gray-500">{company.email}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(company._id)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(company._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}