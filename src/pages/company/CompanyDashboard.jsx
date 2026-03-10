import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/common/Loader";
import { getCompanyJobs } from "../../services/jobService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CompanyDashboard() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCompanyJobs();
      setJobs(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const totalApplicants = jobs.reduce(
      (sum, j) => sum + (j.applicationsCount || 0),
      0
    );
    const activeJobs = jobs.filter((j) => j.status !== "closed").length;

    return { totalJobs, totalApplicants, activeJobs };
  }, [jobs]);

  const chartData = useMemo(() => {
    return jobs.map((j) => ({
      title: j.title?.slice(0, 10) + (j.title?.length > 10 ? "..." : ""),
      applicants: j.applicationsCount || 0,
    }));
  }, [jobs]);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Jobs" value={stats.totalJobs} />
        <StatCard title="Active Jobs" value={stats.activeJobs} />
        <StatCard title="Total Applicants" value={stats.totalApplicants} />
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold mb-4">Applicants per Job</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applicants" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}