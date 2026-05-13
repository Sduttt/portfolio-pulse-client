"use client";

import { faBoltLightning, faCheckCircle, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

export default function AuthPage() {
    const [tab, setTab] = useState<"register" | "signin">("signin");

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#10131A] px-4 py-16">
            {/* Background glows */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] h-125 w-125 rounded-full bg-[#A2BAF0]/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] h-150 w-150 rounded-full bg-[#10B981]/5 blur-[120px]" />
            </div>

            <main className="flex w-full max-w-5xl flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
                {/* Left branding — hidden on mobile */}
                <div className="hidden w-80 shrink-0 flex-col gap-6 lg:flex">
                    <Image src="/Logo.png" alt="Portfolio Pulse" width={150} height={38} />

                    <div>
                        <h2 className="font-hanken text-2xl font-bold text-white">
                            Your AI-powered
                        </h2>
                        <h2 className="font-hanken text-2xl font-bold text-[#A2BAF0]">
                            trading edge.
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-gray-400">
                            Join 50,000+ professional traders using real-time AI insights to
                            maximise their portfolio performance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {[
                            { icon: faShieldHalved, color: "#10B981", text: "End-to-end encrypted" },
                            { icon: faBoltLightning, color: "#A2BAF0", text: "Real-time AI analysis" },
                            { icon: faCheckCircle, color: "#10B981", text: "Cancel anytime" },
                        ].map(({ icon, color, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <FontAwesomeIcon icon={icon} className="size-4 shrink-0" style={{ color }} />
                                <p className="text-sm text-gray-400">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right form column */}
                <div className="w-full min-w-0 flex-1">
                    <div className="glass-panel rounded-2xl p-6 shadow-2xl md:p-10">
                        {/* Header + tab switcher */}
                        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="font-hanken text-xl font-bold text-white md:text-2xl">
                                    {tab === "register" ? "Create Account" : "Welcome Back"}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {tab === "register"
                                        ? "Set up your professional trader profile"
                                        : "Sign in to your Portfolio Pulse account"}
                                </p>
                            </div>
                            <div className="flex w-fit gap-1 rounded-full bg-[#1D2027] p-1">
                                <button
                                    type="button"
                                    onClick={() => setTab("register")}
                                    className={`rounded-full cursor-pointer px-5 py-1.5 text-sm font-semibold transition ${
                                        tab === "register"
                                            ? "bg-[#4D8EFF] text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-200"
                                    }`}
                                >
                                    Register
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTab("signin")}
                                    className={`rounded-full cursor-pointer px-5 py-1.5 text-sm font-semibold transition ${
                                        tab === "signin"
                                            ? "bg-[#4D8EFF] text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-200"
                                    }`}
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>

                        {/* Form — swaps based on active tab */}
                        {tab === "register" ? <Signup onSwitchToSignin={() => setTab("signin")} /> : <Signin onSwitchToRegister={() => setTab("register")} />}
                    </div>
                </div>
            </main>
        </div>
    );
}
