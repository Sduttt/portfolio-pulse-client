"use client";

import { authApi } from "@/lib/api/auth";
import { faMagnifyingGlass, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
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
        <header className="sticky top-0 py-10 z-40 flex items-center justify-between h-16 w-full px-4 md:px-10 bg-[#10131a]/80 backdrop-blur-md border-b border-white/10 shadow-sm">
            {/* Logo */}
            <Link href="/" className="shrink-0">
                <Image src="/Logo.png" alt="Portfolio Pulse" width={70} height={40} priority />
            </Link>

            {/* Search bar */}
            <div className="relative hidden sm:block w-64 lg:w-80">
                <input
                    type="text"
                    placeholder="Search markets..."
                    className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-2 pr-10 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs"
                />
            </div>

            {/* Profile */}
            <div className="relative flex items-center gap-3" ref={dropdownRef}>
                {profile?.fullName && (
                    <span className="hidden sm:block text-lg text-gray-300 font-semibold">
                        {profile.fullName.charAt(0).toUpperCase() + profile.fullName.slice(1).split(" ")[0]}
                    </span>
                )}
                <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-gray-300 hover:bg-white/20 transition-colors overflow-hidden"
                    aria-label="Profile menu"
                >
                    {profile?.avatar ? (
                        <Image
                            src={profile.avatar}
                            alt={profile.fullName ?? "Profile"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className="text-sm" />
                    )}
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#1d2027] border border-white/10 shadow-lg overflow-hidden">
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-xs text-blue-400" />
                            View Profile
                        </Link>
                        <button
                            onClick={signOut}
                            disabled={loadingSignout}
                            className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors border-t border-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loadingSignout ? (
                                <Loader size="sm" color="border-red-400" />
                            ) : (
                                <FontAwesomeIcon icon={faRightFromBracket} className="text-xs text-red-400" />
                            )}
                            {loadingSignout ? "Signing out..." : "Sign Out"}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
