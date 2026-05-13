import apiClient from "../apiClient";

export const tradeApi = {
    getAll: () => apiClient.get("/trade"),

    getById: (id: string) => apiClient.get(`/trade/${id}`),

    create: (data: unknown) => apiClient.post("/trade", data),

    update: (id: string, data: unknown) => apiClient.put(`/trade/${id}`, data),

    delete: (id: string) => apiClient.delete(`/trade/${id}`),

    getAnalysis: (id: string) => apiClient.get(`/trade/${id}/analysis`),
};
