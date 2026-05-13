import apiClient from "../apiClient";

export const authApi = {
    register: (data: {
        email: string;
        password: string;
        fullName: string;
        profession?: string;
        bio?: string;
        dateOfBirth?: string;
        gender?: string;
        address?: { city: string; country: string };
        avatar?: File;
    }) => {
        const form = new FormData();
        form.append("email", data.email);
        form.append("password", data.password);
        form.append("fullName", data.fullName);
        if (data.profession) form.append("profession", data.profession);
        if (data.bio) form.append("bio", data.bio);
        if (data.dateOfBirth) form.append("dateOfBirth", data.dateOfBirth);
        if (data.gender) form.append("gender", data.gender);
        if (data.address) form.append("address", JSON.stringify(data.address));
        // Only append avatar if a file was actually selected and has content
        if (data.avatar && data.avatar.size > 0) form.append("avatar", data.avatar);
        return apiClient.post("/user/register", form);
    },

    login: (data: { email: string; password: string }) => apiClient.post("/user/login", data),

    logout: () => apiClient.post("/user/logout", {}),

    getProfile: () => apiClient.get("/user/profile"),
};
