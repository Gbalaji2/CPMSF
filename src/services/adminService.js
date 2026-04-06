import api from "./api";

/* Dashboard */
export const getAdminStats = async () => {
  const { data } = await api.get("/admin/overview");
  return data;
};

/* Students */
export const getAllStudents = async () => {
  const { data } = await api.get("/admin/students");
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await api.delete(`/admin/students/${id}`);
  return data;
};

/* Companies */
export const getAllCompanies = async () => {
  const { data } = await api.get("/admin/companies");
  return data;
};

export const approveCompany = async (id) => {
  const { data } = await api.patch(`/admin/companies/${id}/approve`);
  return data;
};

export const rejectCompany = async (id) => {
  const { data } = await api.put(`/admin/companies/${id}/reject`);
  return data;
};

export const deleteCompany = async (id) => {
  const { data } = await api.delete(`/admin/companies/${id}`);
  return data;
};

/* Jobs */
export const getAllJobsAdmin = async () => {
  const { data } = await api.get("/admin/jobs");
  return data;
};

export const deleteJobAdmin = async (id) => {
  const { data } = await api.delete(`/admin/jobs/${id}`);
  return data;
};

/* Drives */
export const getAllDrivesAdmin = async () => {
  const { data } = await api.get("/admin/drives");
  return data;
};

export const createDrive = async (payload) => {
  const { data } = await api.post("/admin/drives", payload);
  return data;
};

export const deleteDrive = async (id) => {
  const { data } = await api.delete(`/admin/drives/${id}`);
  return data;
};

/* Reports */
export const exportReportsPDF = async () => {
  const { data } = await api.get("/admin/reports/pdf");
  return data;
};

export const exportReportsCSV = async () => {
  const { data } = await api.get("/admin/reports/csv");
  return data;
};