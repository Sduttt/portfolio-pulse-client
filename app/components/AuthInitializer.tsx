"use client";

import { useEffect, useState } from "react";
import EmailVerificationModal from "./EmailVerificationModal";
import { authApi } from "@/lib/api/auth";

export default function AuthInitializer() {
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("profile");
        if (!stored) return;

        let cachedEmail: string | null = null;
        try {
            const profile = JSON.parse(stored).data;
            if (!profile || profile.emailVerified !== false) return;
            cachedEmail = profile.email ?? "";
        } catch {
            return;
        }

        // localStorage says unverified — confirm with a fresh API call so a
        // recently-verified user isn't blocked by stale cached data
        authApi
            .getProfile()
            .then((res) => {
                const fresh = res.data?.data ?? res.data;
                // Update localStorage so subsequent mounts are accurate
                try {
                    const parsed = JSON.parse(localStorage.getItem("profile") ?? "{}");
                    parsed.data = fresh;
                    localStorage.setItem("profile", JSON.stringify(parsed));
                } catch {
                    // ignore
                }
                if (fresh?.emailVerified === false) {
                    setUnverifiedEmail(fresh.email ?? cachedEmail ?? "");
                }
            })
            .catch(() => {
                // If the API fails (e.g. not logged in) don't show the modal
            });
    }, []);

    if (!unverifiedEmail) return null;

    return <EmailVerificationModal email={unverifiedEmail} />;
}
