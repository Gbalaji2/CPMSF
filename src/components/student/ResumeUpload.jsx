import { useRef, useState } from "react";
import api from "../../services/api";

export default function ResumeUpload({ currentResumeUrl, onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError("");

    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selected.type)) {
      setError("Only PDF or Word documents are allowed.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await api.post("/students/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess(data.resumeUrl);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Resume</h3>
        <p className="text-sm text-gray-500">
          Upload your latest resume (PDF/DOC, max 5MB)
        </p>
      </div>

      {/* Existing Resume */}
      {currentResumeUrl && (
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border">
          <span className="text-sm text-gray-700 truncate">
            Resume Uploaded
          </span>

          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline"
          >
            View
          </a>
        </div>
      )}

      {/* File Input */}
      <div className="space-y-3">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="block w-full text-sm border rounded-xl p-2"
        />

        {file && (
          <div className="text-sm text-gray-600">
            Selected: <span className="font-medium">{file.name}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-2 rounded-xl bg-black text-white disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
}