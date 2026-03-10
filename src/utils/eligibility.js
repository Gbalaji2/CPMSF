export const checkEligibility = (student, job) => {
  if (!student || !job) return { eligible: false, reason: "Loading..." };

  if (!student.resumeUrl) {
    return { eligible: false, reason: "Upload resume to apply." };
  }

  if (job.minCgpa && Number(student.cgpa) < Number(job.minCgpa)) {
    return { eligible: false, reason: `Minimum CGPA is ${job.minCgpa}` };
  }

  if (job.skills?.length > 0) {
    const studentSkills = (student.skills || []).map((s) =>
      s.toLowerCase().trim()
    );

    const missing = job.skills.filter(
      (req) => !studentSkills.includes(req.toLowerCase().trim())
    );

    if (missing.length > 0) {
      return {
        eligible: false,
        reason: `Missing skills: ${missing.join(", ")}`,
      };
    }
  }

  return { eligible: true, reason: "" };
};