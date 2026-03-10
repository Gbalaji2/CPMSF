import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applyToJob, getMyApplications } from "../../services/applicationService";
import { getJobById } from "../../services/jobService";

export default function StudentJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);

  const [error, setError] = useState("");
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobRes, appsRes, studentRes] = await Promise.all([
        getJobById(id),
        getMyApplications(),
        getStudentProfile(),
        ]);

setStudent(studentRes.student);

      setJob(jobRes.job);
      setApplications(appsRes.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const alreadyApplied = useMemo(() => {
    return applications.some((a) => (a.job?._id || a.jobId) === id);
  }, [applications, id]);

  // Eligibility check (simple version)
  const eligibility = useMemo(() => {
  if (!job || !student) return { eligible: false, reason: "Loading..." };

  // CGPA Check
  if (job.minCgpa && Number(student.cgpa) < Number(job.minCgpa)) {
    return {
      eligible: false,
      reason: `Minimum CGPA required is ${job.minCgpa}`,
    };
  }

  // Resume check
  if (!student.resumeUrl) {
    return {
      eligible: false,
      reason: "Upload your resume to apply.",
    };
  }

  // Skills check (basic)
  if (job.skills?.length > 0) {
    const studentSkills = (student.skills || []).map((s) =>
      s.toLowerCase().trim()
    );

    const missingSkills = job.skills.filter(
      (req) => !studentSkills.includes(req.toLowerCase().trim())
    );

    if (missingSkills.length > 0) {
      return {
        eligible: false,
        reason: `Missing required skills: ${missingSkills.join(", ")}`,
      };
    }
  }

  return { eligible: true, reason: "" };
    }, [job, student]);

  const handleApply = async () => {
    try {
      setApplyLoading(true);
      await applyToJob(id);
      await fetchData();
      alert("Applied successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to apply.");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/student/jobs")}
          className="mt-4 px-4 py-2 rounded-xl bg-black text-white"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-600">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-gray-600 text-sm">
            {job.company?.name || "Company"} • {job.location || "Location N/A"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/student/jobs")}
            className="px-4 py-2 rounded-xl border"
          >
            Back
          </button>

          <button
            disabled={
              alreadyApplied || applyLoading || !eligibility.eligible
            }
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-black text-white disabled:opacity-50"
          >
            {alreadyApplied
              ? "Already Applied"
              : applyLoading
              ? "Applying..."
              : "Apply Now"}
          </button>
        </div>
      </div>

      {/* Eligibility Banner */}
      {!eligibility.eligible && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm">
          <p className="font-semibold">Not Eligible</p>
          <p>{eligibility.reason}</p>
        </div>
      )}

      {/* Job Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Main Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-5">
          <Section title="Job Description">
            <p className="text-gray-700 text-sm leading-relaxed">
              {job.description || "No description provided."}
            </p>
          </Section>

          <Section title="Responsibilities">
            {job.responsibilities?.length > 0 ? (
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
                {job.responsibilities.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">
                No responsibilities mentioned.
              </p>
            )}
          </Section>

          <Section title="Required Skills">
            {job.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No skills specified.</p>
            )}
          </Section>
        </div>

        {/* Right: Summary */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg">Job Summary</h3>

          <InfoRow label="Company" value={job.company?.name || "N/A"} />
          <InfoRow label="Role" value={job.title || "N/A"} />
          <InfoRow label="Location" value={job.location || "N/A"} />
          <InfoRow label="Type" value={job.jobType || "N/A"} />
          <InfoRow label="CTC" value={job.ctc ? `${job.ctc} LPA` : "N/A"} />
          <InfoRow
            label="Min CGPA"
            value={job.minCgpa ? job.minCgpa : "N/A"}
          />
          <InfoRow
            label="Deadline"
            value={
              job.deadline
                ? new Date(job.deadline).toLocaleDateString()
                : "N/A"
            }
          />

          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500">
              Note: Eligibility rules can be stricter depending on your profile.
            </p>
          </div>
        </div>
      </div>

      {/* Company Section */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold text-lg mb-3">About Company</h3>

        <p className="text-gray-700 text-sm leading-relaxed">
          {job.company?.description || "No company description available."}
        </p>

        {job.company?.website && (
          <a
            href={job.company.website}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 text-sm text-blue-600 underline"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <p className="text-gray-600">{label}</p>
      <p className="font-medium text-gray-900 text-right">{value}</p>
    </div>
  );
}