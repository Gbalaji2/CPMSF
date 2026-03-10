import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import { getCompanyJobs } from "../../services/jobService";
import { Link } from "react-router-dom";

export default function CompanyJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
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
    fetchJobs();
  }, []);

  if (loading) return <Loader text="Loading jobs..." />;

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">My Jobs</h1>

        <Link
          to="/company/jobs/new"
          className="px-4 py-2 rounded-xl bg-black text-white text-sm"
        >
          + Post Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-gray-500">No jobs posted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Title</th>
                <th>Min CGPA</th>
                <th>Applicants</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-b last:border-none">
                  <td className="py-3 font-medium">{job.title}</td>
                  <td>{job.minCgpa || "-"}</td>
                  <td>{job.applicationsCount || 0}</td>
                  <td>
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                      {job.status || "open"}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/company/jobs/${job._id}/applicants`}
                      className="px-4 py-2 rounded-xl bg-black text-white text-sm"
                    >
                      View Applicants
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}