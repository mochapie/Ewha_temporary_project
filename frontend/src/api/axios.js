// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소
  withCredentials: true, // CORS 쿠키 등 보낼 때 필요 (선택)
});

// ✅ 요청할 때마다 JWT 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
