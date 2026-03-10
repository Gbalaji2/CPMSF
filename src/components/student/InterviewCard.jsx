import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../utils/formatDate";

export default function InterviewCard({ interview }) {
  const navigate = useNavigate();

  const isUpcoming =
    interview.status !== "completed" && new Date(interview.slot) > new Date();

  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">
            {interview.company?.name || "Company"}
          </h3>
          <p className="text-sm text-gray-600">
            {interview.job?.title || "Job"} •{" "}
            {interview.format || "virtual"}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            interview.status === "completed"
              ? "bg-gray-100 text-gray-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {interview.status}
        </span>
      </div>

      <p className="text-sm">
        <span className="text-gray-600">Slot:</span>{" "}
        <span className="font-medium">{formatDateTime(interview.slot)}</span>
      </p>

      {interview.format === "virtual" && (
        <button
          disabled={!isUpcoming}
          onClick={() => navigate(`/student/interviews/${interview._id}/join`)}
          className="w-full mt-2 px-4 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-50"
        >
          {isUpcoming ? "Join Interview" : "Not Available"}
        </button>
      )}
    </div>
  );
}