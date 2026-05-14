"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { subscriptionApi } from "@/lib/api/subscription";
import Loader from "@/app/components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleXmark,
    faCrown,
} from "@fortawesome/free-solid-svg-icons";

type Status = "loading" | "success" | "error" | "missing";

function SubscriptionSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<Status>(sessionId ? "loading" : "missing");
    const [message, setMessage] = useState<string>("");
    const called = useRef(false);

    useEffect(() => {
        if (!sessionId || called.current) return;
        called.current = true;

        subscriptionApi
            .verifySession(sessionId)
            .then((res) => {
                setMessage(
                    res.data?.message ?? "Your Pulse Pro subscription is now active."
                );
                setStatus("success");

                // Update cached profile so the rest of the app reflects PRO status
                try {
                    const raw = localStorage.getItem("profile");
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed?.data) {
                            parsed.data.subscriptionStatus = true;
                            localStorage.setItem("profile", JSON.stringify(parsed));
                        }
                    }
                } catch {
                    // ignore stale cache issues
                }

                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 3000);
            })
            .catch((err) => {
                setMessage(
                    err.response?.data?.message ??
                        "We could not verify your payment. Please contact support if you were charged."
                );
                setStatus("error");
            });
    }, [sessionId]);

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
                                    Confirming your payment…
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">
                                    Please wait while we activate your subscription.
                                </p>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10">
                                <FontAwesomeIcon
                                    icon={faCrown}
                                    className="text-3xl text-yellow-400"
                                />
                            </div>
                            <div>
                                <h1 className="font-hanken text-xl font-bold text-[#adc6ff]">
                                    Welcome to Pulse Pro!
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">{message}</p>
                                <p className="mt-2 text-xs text-gray-500">
                                    Redirecting to dashboard…
                                </p>
                            </div>
                            <div className="flex w-full flex-col gap-2 border-t border-gray-700/30 pt-4">
                                <p className="text-xs text-gray-600">
                                    You now have access to AI trade analysis, rationality scores,
                                    and sentiment feeds.
                                </p>
                            </div>
                            <Link
                                href="/dashboard"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4d8eff] px-6 py-3 font-hanken text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100"
                            >
                                <FontAwesomeIcon icon={faCircleCheck} />
                                Go to Dashboard
                            </Link>
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
                            <div className="flex w-full gap-3">
                                <Link
                                    href="/profile"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#4d8eff]/40 px-4 py-2.5 text-sm text-[#adc6ff] transition-colors hover:bg-[#4d8eff]/10"
                                >
                                    Try Again
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-700/40 px-4 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-700/30 hover:text-gray-200"
                                >
                                    Dashboard
                                </Link>
                            </div>
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
                                    No session ID was found in this URL. Please use the link
                                    provided after checkout.
                                </p>
                            </div>
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 rounded-xl border border-[#4d8eff]/40 px-6 py-2.5 text-sm text-[#adc6ff] transition-colors hover:bg-[#4d8eff]/10"
                            >
                                Back to Profile
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SubscriptionSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#10131a]">
                    <Loader size="lg" color="border-[#4d8eff]" />
                </div>
            }
        >
            <SubscriptionSuccessContent />
        </Suspense>
    );
}
