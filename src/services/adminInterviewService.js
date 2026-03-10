import api from "./api";

export const getAllInterviews = async () => {
  const { data } = await api.get("/interviews");
  return data;
};

export const scheduleInterview = async (payload) => {
  const { data } = await api.post("/interviews", payload);
  return data;
};

export const updateInterview = async (id, payload) => {
  const { data } = await api.put(`/interviews/${id}`, payload);
  return data;
};

export const deleteInterview = async (id) => {
  const { data } = await api.delete(`/interviews/${id}`);
  return data;
};