import api from "./api";

// STUDENT
export const getAllJobs = async () => {
  const { data } = await api.get("/jobs");
  return data;
};

export const getJobById = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

// COMPANY
export const getCompanyJobs = async () => {
  const { data } = await api.get("/companies/jobs");
  return data;
};

export const createJob = async (payload) => {
  const { data } = await api.post("/companies/jobs", payload);
  return data;
};

export const getJobApplicants = async (jobId) => {
  const { data } = await api.get(`/companies/jobs/${jobId}/applicants`);
  return data;
};

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};