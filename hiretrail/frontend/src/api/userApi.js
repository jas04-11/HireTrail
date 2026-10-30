import api from "./axios";

export const userApi = {
  updateProfile: (data) => api.put("/users/profile", data),
  getPublicProfile: (id) => api.get(`/users/${id}`),
  toggleBookmark: (experienceId) => api.put(`/users/bookmarks/${experienceId}`),
  getMyBookmarks: () => api.get("/users/bookmarks/me"),
};
