import api from "./api";

/* ===============================
   DASHBOARD OVERVIEW
================================= */

// Admin dashboard summary
export const getDashboardStats = async () => {
  const { data } = await api.get("/analytics/dashboard");
  return data;
};

/* ===============================
   STUDENT ANALYTICS
================================= */

// Total students by department
export const getStudentsByDepartment = async () => {
  const { data } = await api.get("/analytics/students/departments");
  return data;
};

// Student placement status distribution
export const getStudentPlacementStats = async () => {
  const { data } = await api.get("/analytics/students/placements");
  return data;
};

/* ===============================
   COMPANY ANALYTICS
================================= */

// Total companies and active companies
export const getCompanyStats = async () => {
  const { data } = await api.get("/analytics/companies");
  return data;
};

// Top recruiting companies
export const getTopCompanies = async () => {
  const { data } = await api.get("/analytics/companies/top");
  return data;
};

/* ===============================
   JOB ANALYTICS
================================= */

// Jobs posted per month
export const getJobsTrend = async () => {
  const { data } = await api.get("/analytics/jobs/trend");
  return data;
};

// Jobs by department
export const getJobsByDepartment = async () => {
  const { data } = await api.get("/analytics/jobs/departments");
  return data;
};

/* ===============================
   INTERVIEW ANALYTICS
================================= */

// Interview status breakdown
export const getInterviewStats = async () => {
  const { data } = await api.get("/analytics/interviews");
  return data;
};

// Interview monthly trend
export const getInterviewTrend = async () => {
  const { data } = await api.get("/analytics/interviews/trend");
  return data;
};

/* ===============================
   PLACEMENT ANALYTICS
================================= */

// Overall placement rate
export const getPlacementRate = async () => {
  const { data } = await api.get("/analytics/placements/rate");
  return data;
};

// Salary distribution
export const getSalaryDistribution = async () => {
  const { data } = await api.get("/analytics/placements/salary");
  return data;
};