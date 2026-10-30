import api from "./axios";

export const companyApi = {
  list: (params) => api.get("/companies", { params }),
  getBySlug: (slug) => api.get(`/companies/${slug}`),
};
