import api from "./api";

export const getAllCompanies = async () => {
  const { data } = await api.get("/companies");
  return data;
};

export const createCompany = async (payload) => {
  const { data } = await api.post("/companies", payload);
  return data;
};

export const updateCompany = async (id, payload) => {
  const { data } = await api.put(`/companies/${id}`, payload);
  return data;
};

export const deleteCompany = async (id) => {
  const { data } = await api.delete(`/companies/${id}`);
  return data;
};

export const verifyCompany = async (id) => {
  const { data } = await api.patch(`/companies/${id}/verify`);
  return data;
};

export const blockCompany = async (id) => {
  const { data } = await api.patch(`/companies/${id}/block`);
  return data;
};