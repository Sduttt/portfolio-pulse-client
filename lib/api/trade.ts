import apiClient from "../apiClient";

export const tradeApi = {
    getAll: () => apiClient.get("/trades"),

    getById: (id: string) => apiClient.get(`/trades/${id}`),

    create: (data: unknown) => apiClient.post("/trades", data),

    update: (id: string, data: unknown) => apiClient.put(`/trades/${id}`, data),

    delete: (id: string) => apiClient.delete(`/trades/${id}`),

    getAnalysis: (id: string) => apiClient.get(`/trades/${id}/analysis`),
};
