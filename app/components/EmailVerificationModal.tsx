"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck, faPaperPlane, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { authApi } from "@/lib/api/auth";
import Loader from "./Loader";

export default function EmailVerificationModal({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [signingOut, setSigningOut] = useState(false);

    const sendEmail = async () => {
        setLoading(true);
        setError(null);
        try {
            await authApi.sendVerificationEmail(email);
            setSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Failed to send verification email.");
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setSigningOut(true);
        try {
            await authApi.logout();
        } finally {
            localStorage.removeItem("profile");
            window.location.href = "/auth";
        }
    };

    return (
        /* Backdrop — pointer events blocked, no close on click */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="glass-panel w-full max-w-md rounded-2xl p-8 flex flex-col items-center gap-6 text-center shadow-2xl">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-[#4d8eff]/10 border border-[#4d8eff]/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="text-3xl text-[#adc6ff]" />
                </div>

                {/* Heading */}
                <div>
                    <h2 className="font-hanken text-xl font-bold text-[#adc6ff]">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                        Your account is not yet verified. Please verify{" "}
                        <span className="text-[#A2BAF0]">{email}</span> to continue using
                        Portfolio Pulse.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <p className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </p>
                )}

                {sent ? (
                    /* Success state */
                    <div className="flex flex-col items-center gap-3">
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 w-full">
                            Verification email sent! Check your inbox and click the link.
                        </div>
                        <button
                            onClick={sendEmail}
                            disabled={loading}
                            className="text-sm text-gray-500 hover:text-[#A2BAF0] transition-colors cursor-pointer"
                        >
                            Resend email
                        </button>
                    </div>
                ) : (
                    /* Send button */
                    <button
                        onClick={sendEmail}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#4d8eff] py-3.5 font-hanken font-bold text-sm text-[#001a42] shadow-lg shadow-[#4d8eff]/20 hover:bg-[#4d8eff]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <Loader size="sm" color="border-[#001a42]" />
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                Send Verification Email
                            </>
                        )}
                    </button>
                )}

                {/* Sign out escape hatch */}
                <button
                    onClick={signOut}
                    disabled={signingOut}
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                >
                    {signingOut ? (
                        <Loader size="sm" color="border-red-400" />
                    ) : (
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    )}
                    Sign out
                </button>
            </div>
        </div>
    );
}
