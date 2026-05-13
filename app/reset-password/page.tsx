"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLock,
    faEye,
    faEyeSlash,
    faCircleCheck,
    faArrowRightToBracket,
    faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { authApi } from "@/lib/api/auth";
import Loader from "@/app/components/Loader";

/* ── Password strength rules ── */
const rules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

function PasswordField({
    label,
    value,
    onChange,
    show,
    onToggle,
    placeholder = "••••••••",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    placeholder?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-jetbrains text-xs font-semibold tracking-widest text-gray-400 uppercase">
                {label}
            </label>
            <div className="flex items-center rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-2 transition-colors focus-within:border-[#A2BAF0] focus-within:ring-1 focus-within:ring-[#A2BAF0]">
                <FontAwesomeIcon icon={faLock} className="mr-3 shrink-0 text-gray-500" />
                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-200 scheme-dark placeholder:text-gray-600 focus:outline-none"
                    required
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="ml-2 shrink-0 cursor-pointer text-gray-500 hover:text-gray-300"
                >
                    <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="size-4" />
                </button>
            </div>
        </div>
    );
}

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const passedRules = rules.filter((r) => r.test(password));
    const allRulesPassed = passedRules.length === rules.length;
    const passwordsMatch = password === confirm && confirm.length > 0;
    const canSubmit = allRulesPassed && passwordsMatch && !!token;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        setError(null);
        try {
            await authApi.resetPassword(token!, password);
            setSuccess(true);
            setTimeout(() => {
                window.location.href = "/auth";
            }, 2500);
        } catch (err: any) {
            setError(
                err.response?.data?.message ??
                    "Failed to reset password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#10131a] px-4">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute top-1/3 left-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4d8eff]/10 blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Image src="/Logo.png" alt="Portfolio Pulse" width={90} height={50} priority />
                </div>

                <div className="glass-panel rounded-2xl p-8 shadow-2xl">
                    {/* Missing token */}
                    {!token ? (
                        <div className="flex flex-col items-center gap-6 py-4 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                                <FontAwesomeIcon
                                    icon={faCircleXmark}
                                    className="text-3xl text-red-400"
                                />
                            </div>
                            <div>
                                <h1 className="font-hanken text-xl font-bold text-[#adc6ff]">
                                    Invalid Link
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">
                                    No reset token found. Please use the link from your email.
                                </p>
                            </div>
                            <Link href="/auth" className="text-sm text-[#A2BAF0] hover:underline">
                                Back to Sign In
                            </Link>
                        </div>
                    ) : success ? (
                        /* Success state */
                        <div className="flex flex-col items-center gap-6 py-4 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="text-3xl text-emerald-400"
                                />
                            </div>
                            <div>
                                <h1 className="font-hanken text-xl font-bold text-[#adc6ff]">
                                    Password Reset!
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">
                                    Your password has been updated. Redirecting to sign in…
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <h1 className="font-hanken text-xl font-bold text-white">
                                    Reset your password
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">
                                    Choose a strong new password for your account.
                                </p>
                            </div>

                            <PasswordField
                                label="New Password"
                                value={password}
                                onChange={setPassword}
                                show={showPassword}
                                onToggle={() => setShowPassword((v) => !v)}
                            />

                            {/* Strength rules */}
                            {password.length > 0 && (
                                <ul className="-mt-2 grid grid-cols-2 gap-1.5">
                                    {rules.map((r) => {
                                        const passed = r.test(password);
                                        return (
                                            <li
                                                key={r.label}
                                                className={`flex items-center gap-1.5 text-xs transition-colors ${passed ? "text-emerald-400" : "text-gray-600"}`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                    className={`shrink-0 ${passed ? "text-emerald-400" : "text-gray-700"}`}
                                                />
                                                {r.label}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            <PasswordField
                                label="Confirm Password"
                                value={confirm}
                                onChange={setConfirm}
                                show={showConfirm}
                                onToggle={() => setShowConfirm((v) => !v)}
                            />

                            {/* Match indicator */}
                            {confirm.length > 0 && (
                                <p
                                    className={`-mt-2 flex items-center gap-1.5 text-xs ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}
                                >
                                    <FontAwesomeIcon
                                        icon={passwordsMatch ? faCircleCheck : faCircleXmark}
                                    />
                                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                                </p>
                            )}

                            {error && (
                                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={!canSubmit || loading}
                                className="font-hanken flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#A2BAF0] py-4 text-base font-bold text-[#001A42] shadow-lg shadow-[#A2BAF0]/20 transition hover:bg-[#A2BAF0]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {loading ? (
                                    <Loader size="sm" color="border-[#001A42]" />
                                ) : (
                                    <>
                                        Reset Password
                                        <FontAwesomeIcon
                                            icon={faArrowRightToBracket}
                                            className="size-4"
                                        />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Remembered it?{" "}
                                <Link href="/auth" className="text-[#A2BAF0] hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#10131a]">
                    <Loader size="lg" color="border-[#4d8eff]" />
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}
