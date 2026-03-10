import api from "./api";

// Admin / Management
export const getAllStudents = async () => {
  const { data } = await api.get("/students");
  return data;
};

export const createStudent = async (payload) => {
  const { data } = await api.post("/students", payload);
  return data;
};

export const updateStudent = async (id, payload) => {
  const { data } = await api.put(`/students/${id}`, payload);
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await api.delete(`/students/${id}`);
  return data;
};



// ==============================
// Student Self Profile
// ==============================

export const getStudentProfile = async () => {
  const { data } = await api.get("students/profile");
  return data;
};

export const updateStudentProfile = async (payload) => {
  const { data } = await api.put("students/profile", payload);
  return data;
};

export const uploadResume = async (formData) => {
  const { data } = await api.post("/students/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};