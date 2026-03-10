import api from "./api";

export const getMyInterviews = async () => {
  const { data } = await api.get("/interviews/me");
  return data;
};

export const getInterviewById = async (id) => {
  const { data } = await api.get(`/interviews/${id}`);
  return data;
};

export const getInterviewToken = async (id) => {
  const { data } = await api.get(`/interviews/${id}/token`);
  return data;
};

export const scheduleInterview = async (payload) => {
  const { data } = await api.post("/interviews", payload);
  return data;
};

export const getCompanyInterviews = async () => {
  const { data } = await api.get("/interviews/company");
  return data;
};