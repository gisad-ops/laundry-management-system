import api from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

export const logout = () => localStorage.removeItem("user");

export const getCurrentUser = () =>
  JSON.parse(localStorage.getItem("user") || "null");