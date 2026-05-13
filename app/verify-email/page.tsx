"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { authApi } from "@/lib/api/auth";
import Loader from "@/app/components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

type Status = "loading" | "success" | "error" | "missing";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<Status>(token ? "loading" : "missing");
    const [message, setMessage] = useState<string>("");
    const called = useRef(false);

    useEffect(() => {
        if (!token || called.current) return;
        called.current = true;

        authApi
            .verifyEmail(token)
            .then((res) => {
                setMessage(res.data?.message ?? "Your email has been verified successfully.");
                setStatus("success");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 2000);
            })
            .catch((err) => {
                setMessage(
                    err.response?.data?.message ??
                        "The verification link is invalid or has expired."
                );
                setStatus("error");
            });
    }, [token]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#10131a] px-4">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute top-1/3 left-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4d8eff]/10 blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Image src="/Logo.png" alt="Portfolio Pulse" width={90} height={50} priority />
                </div>

                <div className="glass-panel flex flex-col items-center gap-6 rounded-2xl p-8 text-center">
                    {status === "loading" && (
                        <>
                            <Loader size="lg" color="border-[#4d8eff]" />
                            <div>
                                <h1 className="font-hanken text-xl font-bold text-[#adc6ff]">
                                    Verifying your email…
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">Please wait a moment.</p>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                                <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="text-3xl text-emerald-400"
                                />
                            </div>
                            <div>
                                <h1 className="font-hanken text-xl font-bold text-[#adc6ff]">
                                    Email Verified
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">{message}</p>
                                <p className="mt-2 text-xs text-gray-500">
                                    Redirecting to dashboard…
                                </p>
                            </div>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                                <FontAwesomeIcon
                                    icon={faCircleXmark}
                                    className="text-3xl text-red-400"
                                />
                            </div>
                            <div>
                                <h1 className="font-hanken text-xl font-bold text-[#adc6ff]">
                                    Verification Failed
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">{message}</p>
                            </div>
                            <Link
                                href="/auth"
                                className="flex items-center gap-2 rounded-xl border border-[#4d8eff]/40 px-6 py-2.5 text-sm text-[#adc6ff] transition-colors hover:bg-[#4d8eff]/10"
                            >
                                Back to Sign In
                            </Link>
                        </>
                    )}

                    {status === "missing" && (
                        <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10">
                                <FontAwesomeIcon
                                    icon={faCircleXmark}
                                    className="text-3xl text-yellow-400"
                                />
                            </div>
                            <div>
                                <h1 className="font-hanken text-xl font-bold text-[#adc6ff]">
                                    Invalid Link
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">
                                    No verification token found. Please use the link from your
                                    email.
                                </p>
                            </div>
                            <Link
                                href="/auth"
                                className="flex items-center gap-2 rounded-xl border border-[#4d8eff]/40 px-6 py-2.5 text-sm text-[#adc6ff] transition-colors hover:bg-[#4d8eff]/10"
                            >
                                Back to Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#10131a]">
                    <Loader size="lg" color="border-[#4d8eff]" />
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
