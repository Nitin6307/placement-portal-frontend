import api from "./axios";

export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  return response.data;
};

export const registerUser = async (username, password) => {
  const response = await api.post("/auth/register", {
    username,
    password,
  });

  return response.data;
};