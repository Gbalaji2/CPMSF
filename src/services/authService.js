import api from "./api";

// LOGIN
export const loginUser = async (payload) => {
  // payload = { email, password }
  const { data } = await api.post("/api/auth/login", payload);
  return data;
};

// REGISTER
export const registerUser = async (payload) => {
  // payload = { name, email, password, role }
  const { data } = await api.post("/api/auth/register", payload);
  return data;
};

// GET LOGGED IN USER
export const getMe = async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
};