import api from "./axios";

export const getMyProfile = async () => {
  const response = await api.get("/students/me");
  return response.data;
};

export const getMyRecommendations = async () => {
  const response = await api.get("/recommendations/me");
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications");
  return response.data;
};

export const getSkillGap = async (studentId, jobId) => {
  const response = await api.get(
    `/skill-gap/student/${studentId}/job/${jobId}`
  );

  return response.data;
};
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/students/me/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};