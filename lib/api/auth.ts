import apiClient from "../apiClient";

export const authApi = {
    register: (data: {
        email: string;
        password: string;
        fullName: string;
        profession?: string;
        bio?: string;
        dob?: string;
        gender?: string;
        address?: { city: string; country: string };
        avatar?: File;
        portfolioSizeInINR?: number;
    }) => {
        const form = new FormData();
        form.append("email", data.email);
        form.append("password", data.password);
        form.append("fullName", data.fullName);
        if (data.profession) form.append("profession", data.profession);
        if (data.bio) form.append("bio", data.bio);
        if (data.dob) form.append("dob", data.dob);
        if (data.gender) form.append("gender", data.gender);
        if (data.address) form.append("address", JSON.stringify(data.address));
        if (data.portfolioSizeInINR != null)
            form.append("portfolioSizeInINR", String(data.portfolioSizeInINR));
        // Only append avatar if a file was actually selected and has content
        if (data.avatar && data.avatar.size > 0) form.append("avatar", data.avatar);
        return apiClient.post("/user/register", form);
    },

    login: (data: { email: string; password: string }) => apiClient.post("/user/login", data),

    logout: () => apiClient.post("/user/logout", {}),

    getProfile: () => apiClient.get("/user/profile"),

    updateAvatar: (avatar: File) => {
        const form = new FormData();
        form.append("avatar", avatar);
        return apiClient.patch("/user/profile/avatar", form);
    },

    updateProfile: (data: {
        fullName?: string;
        profession?: string;
        bio?: string;
        dob?: string;
        gender?: string;
        address?: { city: string; country: string };
        portfolioSizeInINR?: number;
    }) => apiClient.patch("/user/profile", data),

    verifyEmail: (token: string) => apiClient.get("/user/verify-email", { params: { token } }),

    forgotPassword: (email: string) => apiClient.post("/user/forgot-password", { email }),

    sendVerificationEmail: (email: string) =>
        apiClient.post("/user/send-verification-email", { email }),

    resetPassword: (token: string, password: string) =>
        apiClient.post("/user/reset-password", { password }, { params: { token } }),
};
