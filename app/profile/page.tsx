"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";
import { subscriptionApi } from "@/lib/api/subscription";
import Loader from "@/app/components/Loader";
import StripeTestModal from "@/app/components/StripeTestModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCamera,
    faPen,
    faXmark,
    faCheck,
    faUser,
    faBriefcase,
    faLocationDot,
    faCalendar,
    faVenusMars,
    faCoins,
    faCrown,
    faBolt,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

interface Profile {
    _id: string;
    fullName: string;
    email: string;
    profession?: string;
    bio?: string;
    dob?: string;
    gender?: string;
    avatar?: string;
    address?: { city: string; country: string };
    createdAt?: string;
    portfolioSizeInINR?: number;
    subscriptionStatus?: boolean;
}

interface FormState {
    fullName: string;
    profession: string;
    bio: string;
    dob: string;
    gender: string;
    city: string;
    country: string;
    portfolioSizeInINR: string;
}

const inputClass =
    "w-full bg-transparent text-gray-200 placeholder:text-gray-600 focus:outline-none text-sm scheme-dark";

const fieldWrap =
    "flex items-center rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-2.5 focus-within:border-[#A2BAF0] focus-within:ring-1 focus-within:ring-[#A2BAF0] transition-colors";

function Field({
    label,
    view,
    edit,
    editing,
    fullWidth = false,
}: {
    label: string;
    view: React.ReactNode;
    edit: React.ReactNode;
    editing: boolean;
    fullWidth?: boolean;
}) {
    return (
        <div className={`flex flex-col gap-2 ${fullWidth ? "md:col-span-2" : ""}`}>
            <label className="font-jetbrains text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                {label}
            </label>
            {editing ? edit : <div className="px-1 text-sm text-gray-200">{view}</div>}
        </div>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<FormState>({
        fullName: "",
        profession: "",
        bio: "",
        dob: "",
        gender: "",
        city: "",
        country: "",
        portfolioSizeInINR: "",
    });
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [dobFieldError, setDobFieldError] = useState<string | null>(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showStripeModal, setShowStripeModal] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Show cached data immediately, then refresh from API
        try {
            const stored = localStorage.getItem("profile");
            if (stored) {
                const parsed: Profile = JSON.parse(stored).data;
                setProfile(parsed);
            }
        } catch {
            // ignore malformed data
        }

        authApi.getProfile().then((res) => {
            const fresh: Profile = res.data?.data ?? res.data;
            setProfile(fresh);
            // Keep localStorage in sync
            try {
                const stored = localStorage.getItem("profile");
                const parsed = stored ? JSON.parse(stored) : {};
                parsed.data = fresh;
                localStorage.setItem("profile", JSON.stringify(parsed));
            } catch {
                // ignore
            }
        }).catch(() => {
            // silently fall back to cached data already rendered
        });
    }, []);

    const patchLocalStorage = (patch: Partial<Profile>) => {
        const stored = localStorage.getItem("profile");
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored);
            parsed.data = { ...parsed.data, ...patch };
            localStorage.setItem("profile", JSON.stringify(parsed));
        } catch {
            // ignore
        }
    };

    const startEdit = () => {
        if (!profile) return;
        setForm({
            fullName: profile.fullName ?? "",
            profession: profile.profession ?? "",
            bio: profile.bio ?? "",
            dob: profile.dob ? profile.dob.slice(0, 10) : "",
            gender: profile.gender ?? "",
            city: profile.address?.city ?? "",
            country: profile.address?.country ?? "",
            portfolioSizeInINR: profile.portfolioSizeInINR != null
                ? String(profile.portfolioSizeInINR)
                : "",
        });
        setError(null);
        setSuccess(null);
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setError(null);
        setDobFieldError(null);
    };

    const saveEdit = async () => {
        // Validate DOB before calling API
        if (form.dob) {
            const maxDob = new Date();
            maxDob.setFullYear(maxDob.getFullYear() - 18);
            if (new Date(form.dob) > maxDob) {
                setDobFieldError("You must be at least 18 years old.");
                setError("Date of birth must be at least 18 years in the past.");
                return;
            }
        }
        setSaving(true);
        setError(null);
        try {
            const res = await authApi.updateProfile({
                fullName: form.fullName,
                profession: form.profession,
                bio: form.bio,
                dob: form.dob || undefined,
                gender: form.gender || undefined,
                address:
                    form.city || form.country
                        ? { city: form.city, country: form.country }
                        : undefined,
                portfolioSizeInINR: form.portfolioSizeInINR
                    ? Number(form.portfolioSizeInINR)
                    : undefined,
            });
            const updated: Profile = res.data?.data ?? res.data;
            setProfile(updated);
            patchLocalStorage(updated);
            setEditing(false);
            setSuccess("Profile updated successfully.");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        setError(null);
        try {
            const res = await authApi.updateAvatar(file);
            const updated: Profile = res.data?.data ?? res.data;
            setProfile((prev) => (prev ? { ...prev, avatar: updated.avatar } : prev));
            patchLocalStorage({ avatar: updated.avatar });
            setSuccess("Avatar updated.");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Failed to update avatar.");
        } finally {
            setAvatarUploading(false);
            e.target.value = "";
        }
    };

    const set =
        (key: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const openCheckoutModal = () => {
        setError(null);
        setShowStripeModal(true);
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const res = await subscriptionApi.createCheckoutSession();
            const url: string = res.data?.url ?? res.data?.checkoutUrl ?? res.data;
            if (url) window.location.href = url;
        } catch (err: any) {
            setShowStripeModal(false);
            setError(err.response?.data?.message ?? "Failed to start checkout. Please try again.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const joinedDate = profile?.createdAt
        ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
              new Date(profile.createdAt)
          )
        : null;

    const dobDisplay = profile?.dob
        ? new Intl.DateTimeFormat("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
          }).format(new Date(profile.dob))
        : null;

    if (!profile) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader size="lg" color="border-[#4d8eff]" />
            </div>
        );
    }

    const locationStr = [profile.address?.city, profile.address?.country]
        .filter(Boolean)
        .join(", ");

    return (
        <>
        {showStripeModal && (
            <StripeTestModal
                onClose={() => setShowStripeModal(false)}
                onProceed={handleCheckout}
                loading={checkoutLoading}
            />
        )}
        <div className="min-h-[80vh] px-4 py-10 md:px-10">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Back link */}
                <Link href="/dashboard" className="flex w-fit items-center gap-2 text-sm text-gray-400 hover:text-[#A2BAF0] transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                    Back to Dashboard
                </Link>
                {/* Banners */}
                {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                        {success}
                    </div>
                )}

                {/* ── Hero card ── */}
                <section className="glass-panel relative overflow-hidden rounded-2xl p-6 md:p-8">
                    <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-[#4d8eff]/8 blur-3xl" />
                    <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start">
                        {/* Avatar */}
                        <div className="group relative shrink-0">
                            <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-[#4d8eff]/30 shadow-2xl shadow-[#4d8eff]/10 md:h-36 md:w-36">
                                {profile.avatar ? (
                                    <Image
                                        src={profile.avatar}
                                        alt={profile.fullName}
                                        width={144}
                                        height={144}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#1d2027]">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-4xl text-[#4d8eff]/30"
                                        />
                                    </div>
                                )}
                            </div>
                            {/* Camera overlay — always available, independent of edit mode */}
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={avatarUploading}
                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                                title="Change avatar"
                            >
                                {avatarUploading ? (
                                    <Loader size="sm" color="border-white" />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        className="text-xl text-white drop-shadow"
                                    />
                                )}
                            </button>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>

                        {/* Name / profession / bio / tags */}
                        <div className="min-w-0 flex-1 space-y-2 text-center md:text-left">
                            <div>
                                <h1 className="font-hanken text-2xl leading-tight font-bold text-[#adc6ff] md:text-3xl">
                                    {profile.fullName}
                                </h1>
                                <div className="mt-0.5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                                    {profile.profession && (
                                        <p className="text-sm font-medium text-[#4edea3]">
                                            {profile.profession}
                                        </p>
                                    )}
                                    {profile.subscriptionStatus && (
                                        <span className="flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-yellow-400">
                                            <FontAwesomeIcon icon={faCrown} className="text-[9px]" />
                                            PRO
                                        </span>
                                    )}
                                </div>
                            </div>
                            {profile.bio && (
                                <p className="max-w-lg text-sm leading-relaxed text-gray-400">
                                    {profile.bio}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 md:justify-start">
                                {locationStr && (
                                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                                        <FontAwesomeIcon
                                            icon={faLocationDot}
                                            className="text-[10px] text-gray-500"
                                        />
                                        {locationStr}
                                    </span>
                                )}
                                {joinedDate && (
                                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                                        <FontAwesomeIcon
                                            icon={faCalendar}
                                            className="text-[10px] text-gray-500"
                                        />
                                        Joined {joinedDate}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Edit / Save / Cancel */}
                        <div className="flex shrink-0 gap-2 self-start">
                            {editing ? (
                                <>
                                    <button
                                        onClick={cancelEdit}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-700/50 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-200"
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEdit}
                                        disabled={saving}
                                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#4d8eff] px-4 py-2 text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving ? (
                                            <Loader size="sm" color="border-[#001a42]" />
                                        ) : (
                                            <FontAwesomeIcon icon={faCheck} />
                                        )}
                                        Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={startEdit}
                                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#4d8eff]/40 px-4 py-2 text-sm text-[#adc6ff] transition-colors hover:bg-[#4d8eff]/10"
                                >
                                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Details card ── */}
                <section className="glass-panel space-y-6 rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="font-jetbrains text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                            Personal Details
                        </h2>
                        {editing && (
                            <span className="font-jetbrains text-[10px] tracking-wider text-[#4d8eff]/70">
                                Editing
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Full Name */}
                        <Field
                            label="Full Name"
                            editing={editing}
                            view={profile.fullName || <span className="text-gray-600">—</span>}
                            edit={
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="mr-3 shrink-0 text-xs text-gray-500"
                                    />
                                    <input
                                        type="text"
                                        value={form.fullName}
                                        onChange={set("fullName")}
                                        className={inputClass}
                                        placeholder="Your full name"
                                    />
                                </div>
                            }
                        />

                        {/* Email — always read-only */}
                        <div className="flex flex-col gap-2">
                            <label className="font-jetbrains text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                                Email
                            </label>
                            <div className="flex items-center gap-2 px-1">
                                <span className="text-sm text-gray-200">{profile.email}</span>
                                <span className="font-jetbrains shrink-0 rounded-full border border-gray-700/40 px-2 py-0.5 text-[9px] text-gray-600">
                                    read-only
                                </span>
                            </div>
                        </div>

                        {/* Profession */}
                        <Field
                            label="Profession"
                            editing={editing}
                            view={profile.profession || <span className="text-gray-600">—</span>}
                            edit={
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon
                                        icon={faBriefcase}
                                        className="mr-3 shrink-0 text-xs text-gray-500"
                                    />
                                    <input
                                        type="text"
                                        value={form.profession}
                                        onChange={set("profession")}
                                        className={inputClass}
                                        placeholder="e.g. Portfolio Manager"
                                    />
                                </div>
                            }
                        />

                        {/* Gender */}
                        <Field
                            label="Gender"
                            editing={editing}
                            view={
                                profile.gender ? (
                                    <span className="capitalize">{profile.gender}</span>
                                ) : (
                                    <span className="text-gray-600">—</span>
                                )
                            }
                            edit={
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon
                                        icon={faVenusMars}
                                        className="mr-3 shrink-0 text-xs text-gray-500"
                                    />
                                    <select
                                        value={form.gender}
                                        onChange={set("gender")}
                                        className={`${inputClass} [&>option]:bg-[#10131A]`}
                                    >
                                        <option value="" disabled>
                                            Select gender
                                        </option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            }
                        />

                        {/* Date of Birth */}
                        <Field
                            label="Date of Birth"
                            editing={editing}
                            view={dobDisplay ?? <span className="text-gray-600">—</span>}
                            edit={
                                <div className="flex flex-col gap-1">
                                    <div className={`${fieldWrap} ${dobFieldError ? "border-red-500/60" : ""}` }>
                                        <FontAwesomeIcon
                                            icon={faCalendar}
                                            className="mr-3 shrink-0 text-xs text-gray-500"
                                        />
                                        <input
                                            type="date"
                                            value={form.dob}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setForm((prev) => ({ ...prev, dob: val }));
                                                if (val) {
                                                    const maxDob = new Date();
                                                    maxDob.setFullYear(maxDob.getFullYear() - 18);
                                                    setDobFieldError(
                                                        new Date(val) > maxDob
                                                            ? "You must be at least 18 years old."
                                                            : null
                                                    );
                                                } else {
                                                    setDobFieldError(null);
                                                }
                                            }}
                                            max={(() => {
                                                const d = new Date();
                                                d.setFullYear(d.getFullYear() - 18);
                                                return d.toISOString().slice(0, 10);
                                            })()}
                                            className={inputClass}
                                        />
                                    </div>
                                    {dobFieldError && (
                                        <p className="text-xs text-red-400">{dobFieldError}</p>
                                    )}
                                </div>
                            }
                        />

                        {/* City */}
                        <Field
                            label="City"
                            editing={editing}
                            view={profile.address?.city || <span className="text-gray-600">—</span>}
                            edit={
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className="mr-3 shrink-0 text-xs text-gray-500"
                                    />
                                    <input
                                        type="text"
                                        value={form.city}
                                        onChange={set("city")}
                                        className={inputClass}
                                        placeholder="Your city"
                                    />
                                </div>
                            }
                        />

                        {/* Country */}
                        <Field
                            label="Country"
                            editing={editing}
                            view={
                                profile.address?.country || <span className="text-gray-600">—</span>
                            }
                            edit={
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className="mr-3 shrink-0 text-xs text-gray-500"
                                    />
                                    <input
                                        type="text"
                                        value={form.country}
                                        onChange={set("country")}
                                        className={inputClass}
                                        placeholder="Your country"
                                    />
                                </div>
                            }
                        />

                        {/* Portfolio Size */}
                        <Field
                            label="Portfolio Size (₹)"
                            editing={editing}
                            view={
                                profile.portfolioSizeInINR != null ? (
                                    <span>
                                        ₹
                                        {profile.portfolioSizeInINR.toLocaleString("en-IN")}
                                    </span>
                                ) : (
                                    <span className="text-gray-600">—</span>
                                )
                            }
                            edit={
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon
                                        icon={faCoins}
                                        className="mr-3 shrink-0 text-xs text-gray-500"
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.portfolioSizeInINR}
                                        onChange={set("portfolioSizeInINR")}
                                        className={inputClass}
                                        placeholder="e.g. 500000"
                                    />
                                </div>
                            }
                        />

                        {/* Bio — full width */}
                        <Field
                            label="Bio"
                            editing={editing}
                            fullWidth
                            view={
                                profile.bio ? (
                                    <span className="leading-relaxed">{profile.bio}</span>
                                ) : (
                                    <span className="text-gray-600">—</span>
                                )
                            }
                            edit={
                                <textarea
                                    value={form.bio}
                                    onChange={set("bio")}
                                    rows={4}
                                    className="w-full resize-none rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-3 text-sm text-gray-200 scheme-dark transition-colors placeholder:text-gray-600 focus:border-[#A2BAF0] focus:ring-1 focus:ring-[#A2BAF0] focus:outline-none"
                                    placeholder="Tell others about yourself..."
                                />
                            }
                        />
                    </div>
                </section>

                {/* ── Subscription card ── */}
                <section className="glass-panel rounded-2xl p-6 md:p-8">
                    <h2 className="font-jetbrains mb-5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                        Subscription
                    </h2>

                    {profile.subscriptionStatus ? (
                        /* PRO user */
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20">
                                <FontAwesomeIcon icon={faCrown} className="text-xl text-yellow-400" />
                            </div>
                            <div>
                                <p className="font-hanken font-bold text-white">
                                    Pulse Pro — Active
                                </p>
                                <p className="text-sm text-gray-400">
                                    You have access to all premium features.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Free user — upgrade prompt */
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4d8eff]/10 border border-[#4d8eff]/20">
                                    <FontAwesomeIcon icon={faBolt} className="text-xl text-[#adc6ff]" />
                                </div>
                                <div>
                                    <p className="font-hanken font-bold text-white">
                                        Upgrade to Pulse Pro
                                    </p>
                                    <p className="mt-0.5 text-sm text-gray-400">
                                        Unlock AI-powered insights, unlimited analysis, and real-time
                                        sentiment feeds.
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        <span className="font-bold text-[#adc6ff] text-sm">₹49</span>
                                        {" "}/ month
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={openCheckoutModal}
                                disabled={checkoutLoading}
                                className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4d8eff] px-6 py-3 font-hanken text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {checkoutLoading ? (
                                    <Loader size="sm" color="border-[#001a42]" />
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faCrown} />
                                        Subscribe — ₹49/mo
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
        </>
    );
}
