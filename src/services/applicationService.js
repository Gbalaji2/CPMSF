import api from "./api";

// STUDENT
export const getMyApplications = async () => {
  const { data } = await api.get("/applications/my");
  return data;
};

export const applyToJob = async (jobId) => {
  const { data } = await api.post(`/applications/apply/${jobId}`);
  return data;
};

// COMPANY
export const updateApplicationStatus = async (applicationId, status) => {
  const { data } = await api.put(
    `/companies/applications/${applicationId}/status`,
    { status }
  );
  return data;
};