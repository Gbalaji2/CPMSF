import { useEffect, useMemo, useState } from "react";
import { getMyInterviews } from "../../services/interviewService";

export default function StudentInterviews() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getMyInterviews();
        setInterviews(res.interviews || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load interviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const upcoming = useMemo(() => {
    const now = new Date();
    return interviews
      .filter((i) => new Date(i.slot) >= now)
      .sort((a, b) => new Date(a.slot) - new Date(b.slot));
  }, [interviews]);

  const past = useMemo(() => {
    const now = new Date();
    return interviews
      .filter((i) => new Date(i.slot) < now)
      .sort((a, b) => new Date(b.slot) - new Date(a.slot));
  }, [interviews]);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "scheduled") return "bg-blue-100 text-blue-700";
    if (s === "completed") return "bg-green-100 text-green-700";
    if (s === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleJoin = (interview) => {
    // Later: navigate to /student/interviews/:id/join
    alert(
      `Joining interview for ${
        interview.company?.name || "Company"
      } (Agora integration next)`
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-600">Loading interviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Interviews</h2>
        <p className="text-gray-600 text-sm">
          View scheduled interviews and join virtual meetings.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Upcoming */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="font-semibold text-lg mb-4">Upcoming Interviews</h3>

        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-600">No upcoming interviews.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcoming.map((i) => (
              <div
                key={i._id}
                className="border rounded-2xl p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {i.company?.name || "Company"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {i.job?.title || "Interview"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(
                      i.status
                    )}`}
                  >
                    {i.status || "scheduled"}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(i.slot).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {new Date(i.slot).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Mode:</span>{" "}
                    {i.format || "virtual"}
                  </p>
                </div>

                {String(i.format).toLowerCase() === "virtual" && (
                  <button
  onClick={() => navigate(`/student/interviews/${item._id}/join`)}
  className="mt-3 w-full py-2 rounded-xl bg-black text-white text-sm"
>
  Join Interview
</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="font-semibold text-lg mb-4">Past Interviews</h3>

        {past.length === 0 ? (
          <p className="text-sm text-gray-600">No past interviews.</p>
        ) : (
          <div className="space-y-3">
            {past.slice(0, 5).map((i) => (
              <div
                key={i._id}
                className="border rounded-2xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {i.company?.name || "Company"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {i.job?.title || "Interview"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(i.slot).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(
                    i.status
                  )}`}
                >
                  {i.status || "completed"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}