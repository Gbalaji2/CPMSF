import api from "./api";

export const getAllDrives = async () => {
  const { data } = await api.get("/drives");
  return data;
};

export const createDrive = async (payload) => {
  const { data } = await api.post("/drives", payload);
  return data;
};

export const updateDrive = async (id, payload) => {
  const { data } = await api.put(`/drives/${id}`, payload);
  return data;
};

export const deleteDrive = async (id) => {
  const { data } = await api.delete(`/drives/${id}`);
  return data;
};