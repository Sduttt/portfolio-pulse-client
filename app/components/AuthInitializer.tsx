"use client";

import { useEffect, useState } from "react";
import EmailVerificationModal from "./EmailVerificationModal";

export default function AuthInitializer() {
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("profile");
            if (!stored) return;
            const profile = JSON.parse(stored).data;
            if (profile && profile.emailVerified === false) {
                setUnverifiedEmail(profile.email ?? "");
            }
        } catch {
            // ignore malformed data
        }
    }, []);

    if (!unverifiedEmail) return null;

    return <EmailVerificationModal email={unverifiedEmail} />;
}
