import api from "./api";

// LOGIN
export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

// REGISTER
export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};