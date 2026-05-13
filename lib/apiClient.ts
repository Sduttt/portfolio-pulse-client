import axios from "axios";

const apiClient = axios.create({
    baseURL:
        typeof window === "undefined"
            ? process.env.NEXT_PUBLIC_API_URL // server-side: call backend directly
            : "/api/proxy", // client-side: go through Next.js rewrite
    withCredentials: true,
});

export default apiClient;
