import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { applyToJob, getMyApplications } from "../../services/applicationService";
import { getAllJobs } from "../../services/jobService";

export default function StudentJobs() {
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(null);
  const [error, setError] = useState("");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    minCgpa: "",
    skill: "",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsRes, appRes] = await Promise.all([
        getAllJobs(filters),
        getMyApplications(),
      ]);

      setJobs(jobsRes.jobs || []);
      setApplications(appRes.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  const appliedJobIds = useMemo(() => {
    return new Set(applications.map((a) => a.job?._id || a.jobId));
  }, [applications]);

  const handleApply = async (jobId) => {
    try {
      setApplyLoading(jobId);
      await applyToJob(jobId);
      await fetchJobs();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to apply.");
    } finally {
      setApplyLoading(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = async () => {
    await fetchJobs();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Jobs</h2>
        <p className="text-gray-600 text-sm">
          Browse jobs and apply to eligible openings.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search job title / company..."
          className="px-3 py-2 border rounded-xl"
        />

        <input
          name="minCgpa"
          value={filters.minCgpa}
          onChange={handleFilterChange}
          placeholder="Min CGPA"
          className="px-3 py-2 border rounded-xl"
        />

        <input
          name="skill"
          value={filters.skill}
          onChange={handleFilterChange}
          placeholder="Skill (React, Java...)"
          className="px-3 py-2 border rounded-xl"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          Search
        </button>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-600">No jobs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const jobId = job._id;
            const alreadyApplied = appliedJobIds.has(jobId);

            return (
              <div
                key={jobId}
                className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600">
                      {job.company?.name || "Company"}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {job.jobType || "Full Time"}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Eligibility:</span>{" "}
                    {job.minCgpa ? `CGPA ≥ ${job.minCgpa}` : "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {job.location || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">CTC:</span>{" "}
                    {job.ctc ? `${job.ctc} LPA` : "Not specified"}
                  </p>
                </div>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 6).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/student/jobs/${jobId}`)}
                    className="flex-1 px-4 py-2 rounded-xl border text-sm"
                >
                    View Details
                   </button>

                  <button
                    disabled={alreadyApplied || applyLoading === jobId}
                    onClick={() => handleApply(jobId)}
                    className="flex-1 px-4 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-50"
                  >
                    {alreadyApplied
                      ? "Applied"
                      : applyLoading === jobId
                      ? "Applying..."
                      : "Apply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}