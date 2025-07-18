import axios from "axios";

const BACKEND_URL = "https://localhost:3001";
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("auth_token");
      localStorage.removeItem("hr_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};

// Candidates API
export const candidatesAPI = {
  create: async (candidateData) => {
    const response = await api.post("/candidates", candidateData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/candidates");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },
};

// Interviews API
export const interviewsAPI = {
  create: async (interviewData) => {
    const response = await api.post("/interviews", interviewData);
    return response.data;
  },
  getAll: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get("/interviews", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },
  update: async (id, updateData) => {
    const response = await api.put(`/interviews/${id}`, updateData);
    return response.data;
  },
  generateQuestions: async (id) => {
    const response = await api.post(`/interviews/${id}/questions`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  generateQuestions: async (requestData) => {
    const response = await api.post("/ai/generate-questions", requestData);
    return response.data;
  },
};

// Job Descriptions API
export const jobDescriptionsAPI = {
  create: async (jobData) => {
    const response = await api.post("/job-descriptions", jobData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/job-descriptions");
    return response.data;
  },
};

// File Upload API
export const uploadAPI = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
