import { Link } from "react-router-dom";

export default function StudentProfileCard({ student }) {
  // Base URL (remove /api if present)
  const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

  if (!student) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-gray-500">
        No student data available.
      </div>
    );
  }

  const profileImage = student.profileImage
    ? `${BASE_URL}${student.profileImage}`
    : `https://ui-avatars.com/api/?name=${student?.name || "User"}`;

  const resumeUrl = student.resumeUrl
    ? `${BASE_URL}${student.resumeUrl}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-2xl object-cover border"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${student?.name || "User"}`;
            }}
          />

          <div>
            <h2 className="text-xl font-bold">{student?.name || "N/A"}</h2>
            <p className="text-sm text-gray-500">{student?.email || "N/A"}</p>
            <p className="text-sm text-gray-500">
              {student?.phone || "No phone added"}
            </p>
          </div>
        </div>

        <Link
          to="/student/profile/edit"
          className="px-4 py-2 rounded-xl bg-black text-white text-sm"
        >
          Edit Profile
        </Link>
      </div>

      {/* Academic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoItem label="Department" value={student?.department || "N/A"} />
        <InfoItem label="Batch" value={student?.batch || "N/A"} />
        <InfoItem label="CGPA" value={student?.cgpa || "N/A"} />
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Skills</h3>
        {student?.skills && student.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {student.skills.map((skill, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 border"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No skills added.</p>
        )}
      </div>

      {/* Resume */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Resume</h3>
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline font-medium"
          >
            View Resume
          </a>
        ) : (
          <p className="text-sm text-gray-500">No resume uploaded.</p>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium mt-1">{value}</p>
    </div>
  );
}