import apiClient from "../apiClient";

export const portfolioApi = {
    getAll: () => apiClient.get("/portfolio"),

    getById: (id: string) => apiClient.get(`/portfolio/${id}`),

    create: (data: unknown) => apiClient.post("/portfolio", data),

    update: (id: string, data: unknown) => apiClient.put(`/portfolio/${id}`, data),

    delete: (id: string) => apiClient.delete(`/portfolio/${id}`),
};
