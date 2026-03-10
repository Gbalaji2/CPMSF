import { useNavigate } from "react-router-dom";

export default function JobCard({ job, eligible, applied, onApply }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{job.title}</h3>
          <p className="text-sm text-gray-600">
            {job.company?.name || "Company"} • {job.location || "N/A"}
          </p>
        </div>

        {eligible.eligible ? (
          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            Eligible
          </span>
        ) : (
          <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
            Not Eligible
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          {job.jobType || "N/A"}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          {job.ctc ? `${job.ctc} LPA` : "CTC N/A"}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          Min CGPA: {job.minCgpa || "N/A"}
        </span>
      </div>

      {!eligible.eligible && (
        <p className="text-xs text-red-600">{eligible.reason}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/student/jobs/${job._id}`)}
          className="flex-1 px-4 py-2 rounded-xl border text-sm"
        >
          View Details
        </button>

        <button
          disabled={!eligible.eligible || applied}
          onClick={() => onApply(job._id)}
          className="flex-1 px-4 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-50"
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}