import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";

import { getJobApplicants } from "../../services/jobService";
import { updateApplicationStatus } from "../../services/applicationService";
import { scheduleInterview } from "../../services/interviewService";
import { formatDateTime } from "../../utils/formatDate";

export default function CompanyApplications() {
  const { jobId } = useParams();

  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [msg, setMsg] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [open, setOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    slot: "",
    format: "virtual",
  });

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const data = await getJobApplicants(jobId);
      setApps(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  // Filtered + searched applicants
  const filteredApps = useMemo(() => {
    return apps.filter((a) => {
      const matchSearch =
        a.student?.name?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || a.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [apps, search, statusFilter]);

  const changeStatus = async (applicationId, status) => {
    try {
      setMsg("");
      await updateApplicationStatus(applicationId, status);

      setApps((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status } : a))
      );

      setMsg(`Updated status: ${status}`);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to update status");
    }
  };

  const openSchedule = (app) => {
    setSelectedApp(app);
    setScheduleForm({ slot: "", format: "virtual" });
    setOpen(true);
  };

  const handleSchedule = async () => {
    if (!scheduleForm.slot) {
      setMsg("Please select interview slot");
      return;
    }

    try {
      await scheduleInterview({
        applicationId: selectedApp._id,
        studentId: selectedApp.student?._id,
        jobId,
        slot: scheduleForm.slot,
        format: scheduleForm.format,
      });

      await changeStatus(selectedApp._id, "shortlisted");

      setMsg("Interview scheduled successfully!");
      setOpen(false);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to schedule interview");
    }
  };

  if (loading) return <Loader text="Loading applicants..." />;

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">

      <h1 className="text-xl font-bold mb-6">Applicants</h1>

      {msg && (
        <p className="text-sm font-medium text-blue-600 mb-4">{msg}</p>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-xl text-sm w-full md:w-60"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-xl text-sm w-full md:w-40"
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      {filteredApps.length === 0 ? (
        <p className="text-sm text-gray-500">No applicants found.</p>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-3">Student</th>
                <th>CGPA</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Applied</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApps.map((a) => (
                <tr key={a._id} className="border-b last:border-none">

                  <td className="py-3 font-medium">
                    {a.student?.name}
                  </td>

                  <td>{a.student?.cgpa || "-"}</td>

                  <td className="max-w-[220px] truncate">
                    {a.student?.skills?.join(", ") || "-"}
                  </td>

                  <td>
                    <StatusBadge status={a.status} />
                  </td>

                  <td>{formatDateTime(a.createdAt)}</td>

                  <td className="text-right space-x-2">

                    {a.student?.resume && (
                      <a
                        href={a.student.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl border text-xs"
                      >
                        Resume
                      </a>
                    )}

                    <button
                      disabled={a.status === "rejected"}
                      onClick={() =>
                        changeStatus(a._id, "shortlisted")
                      }
                      className="px-3 py-2 rounded-xl bg-green-600 text-white text-xs disabled:opacity-40"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(a._id, "rejected")
                      }
                      className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => openSchedule(a)}
                      className="px-3 py-2 rounded-xl bg-black text-white text-xs"
                    >
                      Schedule
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        open={open}
        title="Schedule Interview"
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4">

          <p className="text-sm text-gray-600">
            Student:
            <span className="font-semibold ml-2">
              {selectedApp?.student?.name}
            </span>
          </p>

          <div>
            <label className="text-sm text-gray-600">
              Interview Slot
            </label>

            <input
              type="datetime-local"
              value={scheduleForm.slot}
              onChange={(e) =>
                setScheduleForm({
                  ...scheduleForm,
                  slot: e.target.value,
                })
              }
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Format
            </label>

            <select
              value={scheduleForm.format}
              onChange={(e) =>
                setScheduleForm({
                  ...scheduleForm,
                  format: e.target.value,
                })
              }
              className="w-full mt-2 p-3 border rounded-xl"
            >
              <option value="virtual">Virtual</option>
              <option value="in-person">In Person</option>
            </select>
          </div>

          <button
            onClick={handleSchedule}
            className="w-full bg-black text-white py-2 rounded-xl text-sm"
          >
            Confirm Interview
          </button>

        </div>
      </Modal>

    </div>
  );
}

function StatusBadge({ status }) {

  const map = {
    submitted: "bg-blue-100 text-blue-700",
    shortlisted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}