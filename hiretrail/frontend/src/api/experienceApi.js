import api from "./axios";

export const experienceApi = {
  list: (params) => api.get("/experiences", { params }),
  getById: (id) => api.get(`/experiences/${id}`),
  create: (data) => api.post("/experiences", data),
  update: (id, data) => api.put(`/experiences/${id}`, data),
  remove: (id) => api.delete(`/experiences/${id}`),
  toggleLike: (id) => api.put(`/experiences/${id}/like`),
  addComment: (id, text) => api.post(`/experiences/${id}/comments`, { text }),
  deleteComment: (id, commentId) => api.delete(`/experiences/${id}/comments/${commentId}`),
  mine: () => api.get("/experiences/mine/all"),
};
