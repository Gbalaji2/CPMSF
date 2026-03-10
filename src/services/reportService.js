import api from "./api";

/* ===============================
   STUDENT REPORTS
================================= */

// Get all students report (JSON data)
export const getStudentsReport = async (params = {}) => {
  const { data } = await api.get("/reports/students", { params });
  return data;
};

// Download students report (Excel/PDF)
export const downloadStudentsReport = async (format = "excel") => {
  const response = await api.get(
    `/reports/students/download?format=${format}`,
    { responseType: "blob" }
  );
  return response.data;
};

/* ===============================
   PLACEMENT REPORTS
================================= */

// Placement summary report
export const getPlacementReport = async (params = {}) => {
  const { data } = await api.get("/reports/placements", { params });
  return data;
};

// Download placement report
export const downloadPlacementReport = async (format = "excel") => {
  const response = await api.get(
    `/reports/placements/download?format=${format}`,
    { responseType: "blob" }
  );
  return response.data;
};

/* ===============================
   INTERVIEW REPORTS
================================= */

// Interview report data
export const getInterviewReport = async (params = {}) => {
  const { data } = await api.get("/reports/interviews", { params });
  return data;
};

// Download interview report
export const downloadInterviewReport = async (format = "excel") => {
  const response = await api.get(
    `/reports/interviews/download?format=${format}`,
    { responseType: "blob" }
  );
  return response.data;
};

/* ===============================
   COMPANY REPORTS
================================= */

// Company hiring report
export const getCompanyReport = async (params = {}) => {
  const { data } = await api.get("/reports/companies", { params });
  return data;
};

// Download company report
export const downloadCompanyReport = async (format = "excel") => {
  const response = await api.get(
    `/reports/companies/download?format=${format}`,
    { responseType: "blob" }
  );
  return response.data;
};