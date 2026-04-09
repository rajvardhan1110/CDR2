import axios from "axios";

const api = axios.create({
  baseURL: "http://3.6.41.77:5000/api",
});

// Intercept request to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
