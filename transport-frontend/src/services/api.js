import { Upload } from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const transportApi = {
  getAll: () => api.get("/transports"),
  getById: (id) => api.get(`/transports/${id}`),
  create: (data) => api.post("/transports", data),
  update: (id, data) => api.put(`/transports/${id}`, data),
};

export const materialApi = {
  getAll: () => api.get("/materials"),
  create: (data) => api.post("/materials", data),
  getIds: () => api.get("/materials/ids"),
};

export const vehicleTypeApi = {
  getAll: () => api.get("/vehicle-types"),
  create: (data) => api.post("/vehicle-types", data),
};

export const shipmentApi = {
  getAll: () => api.get("/shipments"),
  getById: (id) => api.get(`/shipments/${id}`),
  create: (data) => api.post("/shipments", data),
  update: (id, data) => api.put(`/shipments/${id}`, data),
  upload: (formData) => api.post("/shipments/upload", formData),
};
