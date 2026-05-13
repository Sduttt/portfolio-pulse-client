import apiClient from "../apiClient";

export const tradeApi = {
    getAll: () => apiClient.get("/trade"),

    getById: (id: string) => apiClient.get(`/trade/${id}`),

    create: (data: unknown) => apiClient.post("/trade", data),

    update: (id: string, data: unknown) => apiClient.patch(`/trade/${id}`, data),

    delete: (id: string) => apiClient.delete(`/trade/${id}`),

    getAnalysis: (id: string) => apiClient.get(`/analysis/${id}`),

    runAnalysis: (id: string) => apiClient.post(`/analysis/${id}`, {}),

    submitFeedback: (id: string, data: { users_response_to_ai: string; users_feedback: string }) =>
        apiClient.patch(`/analysis/${id}/feedback`, data),
};
