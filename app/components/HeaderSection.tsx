"use client";

import { authApi } from "@/lib/api/auth";
import { faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

const EXCLUDED_PATHS: string[] = ["/", "/auth"];

export default function HeaderSection() {
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [profile, setProfile] = useState<Record<string, any> | null>(null);
    const [loadingSignout, setLoadingSignout] = useState(false);

    const isExcluded = EXCLUDED_PATHS.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
    );

    // Read from localStorage on every mount — works because login uses window.location.href (full reload)
    useEffect(() => {
        const stored = localStorage.getItem("profile");
        if (stored) {
            try {
                const parsed = JSON.parse(stored).data;
                setProfile(parsed);
            } catch {
                // ignore malformed data
            }
        } else {
            console.warn("⚠️ No profile found in localStorage");
        }
    }, []);

    const signOut = async () => {
        setLoadingSignout(true);
        try {
            await authApi.logout();
        } finally {
            localStorage.removeItem("profile");
            sessionStorage.removeItem("profile");
            window.location.href = "/auth"; // full reload clears all state cleanly
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isExcluded) return null;

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#10131a]/80 px-4 py-10 shadow-sm backdrop-blur-md md:px-10">
            {/* Logo */}
            <Link href="/" className="shrink-0">
                <Image src="/Logo.png" alt="Portfolio Pulse" width={70} height={40} priority />
            </Link>

            {/* Profile */}
            <div className="relative flex items-center gap-3" ref={dropdownRef}>
                {profile?.fullName && (
                    <span className="hidden text-lg font-semibold text-gray-300 sm:block">
                        {profile.fullName
                            .split(" ")
                            .map(
                                (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                            )
                            .join(" ")}
                    </span>
                )}
                <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-gray-300 transition-colors hover:bg-white/20"
                    aria-label="Profile menu"
                >
                    {profile?.avatar ? (
                        <Image
                            src={profile.avatar}
                            alt={profile.fullName ?? "Profile"}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className="text-sm" />
                    )}
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#1d2027] shadow-lg">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-white/10"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-xs text-blue-400" />
                            View Profile
                        </Link>
                        <button
                            onClick={signOut}
                            disabled={loadingSignout}
                            className="flex w-full cursor-pointer items-center gap-3 border-t border-white/10 px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingSignout ? (
                                <Loader size="sm" color="border-red-400" />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    className="text-xs text-red-400"
                                />
                            )}
                            {loadingSignout ? "Signing out..." : "Sign Out"}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
