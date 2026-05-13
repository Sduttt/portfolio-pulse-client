"use client";

import { faArrowRight, faEye, faEyeSlash, faLock, faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Loader from "@/app/components/Loader";
import { authApi } from "@/lib/api/auth";
import InputField, { inputClass } from "./InputField";

export default function Signin({ onSwitchToRegister, onForgotPassword }: { onSwitchToRegister?: () => void; onForgotPassword?: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const res: any = await authApi.login({ email, password });
            if (res.status === 200) {
                setLoading(false);
                setLoadingProfile(true);
                const profileRes = await authApi.getProfile();
                localStorage.setItem("profile", JSON.stringify(profileRes.data));
                window.location.href = "/dashboard"; // full reload so header reads localStorage fresh
            } else {
                setError(res.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
            setLoadingProfile(false);
        }
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        void signIn();
    };

    return (
        <>
            {loadingProfile && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#10131a]/90 backdrop-blur-sm">
                    <Loader size="lg" color="border-[#A2BAF0]" />
                    <p className="text-sm text-gray-400">Setting up your account...</p>
                </div>
            )}
            <form className="flex flex-col gap-5" onSubmit={handleSignIn}>
            {/* Email */}
            <InputField
                label="Email Address"
                faicon={faMailBulk}
            >
                <input
                    type="email"
                    placeholder="alex@portfolio-pulse.com"
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </InputField>

            {/* Password */}
            <div className="flex flex-col gap-2">
                <label className="font-jetbrains text-xs font-semibold tracking-widest text-gray-400 uppercase">Password</label>
                <div className="flex items-center rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-2 focus-within:border-[#A2BAF0] focus-within:ring-1 focus-within:ring-[#A2BAF0]">
                    <FontAwesomeIcon icon={faLock} className="mr-3 shrink-0 text-gray-500" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={inputClass}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="ml-2 shrink-0 text-gray-500 hover:text-gray-300">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="size-4" />
                    </button>
                </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
                <button type="button" onClick={onForgotPassword} className="text-sm text-[#A2BAF0] hover:underline cursor-pointer">
                    Forgot password?
                </button>
            </div>

            {/* Submit */}
            <div className="mt-2 space-y-4">
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
                            Sign In
                            <FontAwesomeIcon icon={faArrowRight} className="size-4" />
                        </>
                    )}
                </button>
                <p className="text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={onSwitchToRegister} className="cursor-pointer text-[#A2BAF0] hover:underline">
                        Create one
                    </button>
                </p>
            </div>
            </form>
        </>
    );
}
