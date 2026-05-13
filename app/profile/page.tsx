"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { authApi } from "@/lib/api/auth";
import Loader from "@/app/components/Loader";
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
}

interface FormState {
    fullName: string;
    profession: string;
    bio: string;
    dob: string;
    gender: string;
    city: string;
    country: string;
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
    });
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem("profile");
        if (stored) {
            try {
                const parsed: Profile = JSON.parse(stored).data;
                setProfile(parsed);
            } catch {
                // ignore malformed data
            }
        }
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
        });
        setError(null);
        setSuccess(null);
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setError(null);
    };

    const saveEdit = async () => {
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

    const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const joinedDate = profile?.createdAt
        ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
              new Date(profile.createdAt)
          )
        : null;

    const dobDisplay = profile?.dob
        ? new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(
              new Date(profile.dob)
          )
        : null;

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="lg" color="border-[#4d8eff]" />
            </div>
        );
    }

    const locationStr = [profile.address?.city, profile.address?.country].filter(Boolean).join(", ");

    return (
        <div className="py-10 px-4 md:px-10 min-h-[80vh]">
            <div className="max-w-4xl mx-auto space-y-6">
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
                <section className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#4d8eff]/8 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0 group">
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[#4d8eff]/30 shadow-2xl shadow-[#4d8eff]/10">
                                {profile.avatar ? (
                                    <Image
                                        src={profile.avatar}
                                        alt={profile.fullName}
                                        width={144}
                                        height={144}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#1d2027] flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} className="text-4xl text-[#4d8eff]/30" />
                                    </div>
                                )}
                            </div>
                            {/* Camera overlay — always available, independent of edit mode */}
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={avatarUploading}
                                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                title="Change avatar"
                            >
                                {avatarUploading ? (
                                    <Loader size="sm" color="border-white" />
                                ) : (
                                    <FontAwesomeIcon icon={faCamera} className="text-white text-xl drop-shadow" />
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
                        <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
                            <div>
                                <h1 className="font-hanken text-2xl md:text-3xl font-bold text-[#adc6ff] leading-tight">
                                    {profile.fullName}
                                </h1>
                                {profile.profession && (
                                    <p className="mt-0.5 text-sm font-medium text-[#4edea3]">
                                        {profile.profession}
                                    </p>
                                )}
                            </div>
                            {profile.bio && (
                                <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                                    {profile.bio}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                                {locationStr && (
                                    <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-[10px] text-gray-500" />
                                        {locationStr}
                                    </span>
                                )}
                                {joinedDate && (
                                    <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                                        <FontAwesomeIcon icon={faCalendar} className="text-[10px] text-gray-500" />
                                        Joined {joinedDate}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Edit / Save / Cancel */}
                        <div className="flex gap-2 shrink-0 self-start">
                            {editing ? (
                                <>
                                    <button
                                        onClick={cancelEdit}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700/50 text-gray-400 hover:text-gray-200 hover:border-gray-600 text-sm transition-colors cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEdit}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4d8eff] text-[#001a42] font-bold text-sm shadow-lg shadow-[#4d8eff]/20 hover:scale-105 active:scale-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#4d8eff]/40 text-[#adc6ff] hover:bg-[#4d8eff]/10 text-sm transition-colors cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Details card ── */}
                <section className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-jetbrains text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                            Personal Details
                        </h2>
                        {editing && (
                            <span className="text-[10px] font-jetbrains text-[#4d8eff]/70 tracking-wider">
                                Editing
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Full Name */}
                        <Field
                            label="Full Name"
                            editing={editing}
                            view={profile.fullName || <span className="text-gray-600">—</span>}
                            edit={
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon icon={faUser} className="mr-3 shrink-0 text-gray-500 text-xs" />
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
                                <span className="text-[9px] font-jetbrains text-gray-600 border border-gray-700/40 rounded-full px-2 py-0.5 shrink-0">
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
                                    <FontAwesomeIcon icon={faBriefcase} className="mr-3 shrink-0 text-gray-500 text-xs" />
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
                                    <FontAwesomeIcon icon={faVenusMars} className="mr-3 shrink-0 text-gray-500 text-xs" />
                                    <select
                                        value={form.gender}
                                        onChange={set("gender")}
                                        className={`${inputClass} [&>option]:bg-[#10131A]`}
                                    >
                                        <option value="" disabled>Select gender</option>
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
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon icon={faCalendar} className="mr-3 shrink-0 text-gray-500 text-xs" />
                                    <input
                                        type="date"
                                        value={form.dob}
                                        onChange={set("dob")}
                                        max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().slice(0, 10); })()}
                                        className={inputClass}
                                    />
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
                                    <FontAwesomeIcon icon={faLocationDot} className="mr-3 shrink-0 text-gray-500 text-xs" />
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
                            view={profile.address?.country || <span className="text-gray-600">—</span>}
                            edit={
                                <div className={fieldWrap}>
                                    <FontAwesomeIcon icon={faLocationDot} className="mr-3 shrink-0 text-gray-500 text-xs" />
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
                                    className="w-full rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-3 text-gray-200 placeholder:text-gray-600 text-sm resize-none focus:outline-none focus:border-[#A2BAF0] focus:ring-1 focus:ring-[#A2BAF0] transition-colors scheme-dark"
                                    placeholder="Tell others about yourself..."
                                />
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
