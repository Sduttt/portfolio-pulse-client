"use client";

import { useState } from "react";
import { faArrowLeft, faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authApi } from "@/lib/api/auth";
import InputField, { inputClass } from "./InputField";
import Loader from "@/app/components/Loader";

export default function ForgotPassword({ onBack }: { onBack: () => void }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Back button */}
            <button
                type="button"
                onClick={onBack}
                className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#A2BAF0]"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                Back to Sign In
            </button>

            {sent ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="text-2xl text-emerald-400"
                        />
                    </div>
                    <div>
                        <h4 className="font-hanken text-lg font-bold text-white">
                            Check your inbox
                        </h4>
                        <p className="mt-1 text-sm text-gray-400">
                            If an account exists for <span className="text-[#A2BAF0]">{email}</span>
                            , a password reset link has been sent.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-2 cursor-pointer text-sm text-[#A2BAF0] hover:underline"
                    >
                        Return to Sign In
                    </button>
                </div>
            ) : (
                /* ── Form state ── */
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div>
                        <h4 className="font-hanken text-lg font-bold text-white">
                            Forgot your password?
                        </h4>
                        <p className="mt-1 text-sm text-gray-400">
                            Enter your email and we&apos;ll send you a reset link.
                        </p>
                    </div>

                    <InputField label="Email Address" faicon={faEnvelope}>
                        <input
                            type="email"
                            placeholder="alex@portfolio-pulse.com"
                            className={inputClass}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </InputField>

                    {error && (
                        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="font-hanken flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#A2BAF0] py-4 text-base font-bold text-[#001A42] shadow-lg shadow-[#A2BAF0]/20 transition hover:bg-[#A2BAF0]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader size="sm" color="border-[#001A42]" />
                        ) : (
                            <>
                                Send Reset Link
                                <FontAwesomeIcon icon={faPaperPlane} className="size-4" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
