import apiClient from "../apiClient";

export const subscriptionApi = {
    createCheckoutSession: () =>
        apiClient.post("/subscription/create-checkout-session"),
    verifySession: (sessionId: string) =>
        apiClient.post("/subscription/verify-session", { sessionId }),
};
