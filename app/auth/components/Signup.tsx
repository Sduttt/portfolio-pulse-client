"use client";

import { faArrowRight, faCalendar, faCity, faEye, faEyeSlash, faGlobe, faLock, faMailBulk, faSuitcase, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef, useState } from "react";
import Loader from "@/app/components/Loader";
import InputField, { inputClass } from "./InputField";
import { authApi } from "@/lib/api/auth";

export default function Signup({ onSwitchToSignin }: { onSwitchToSignin?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        profession: "",
        email: "",
        dob: "",
        password: "",
        address: {
            city: "",
            country: "",
        },
        gender: "",
        bio: "",
    });
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const avatarFile = useRef<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            avatarFile.current = file;
            setAvatarSrc(URL.createObjectURL(file));
        }
    };

    const submitForm = async () => {
        setLoading(true);
        setModal(null);

        try {
            const result = await authApi.register({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                profession: formData.profession,
                bio: formData.bio,
                dob: formData.dob,
                address: {
                    city: formData.address.city,
                    country: formData.address.country,
                },
                gender: formData.gender,
                avatar: avatarFile.current ?? undefined,
            }) as { success: boolean; message: string };
            setModal({ success: true, message: result.message ?? "Registration successful!" });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong";
            setModal({ success: false, message: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void submitForm();
    };

    return (
        <>
            {/* Result Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <div className={`w-full max-w-sm rounded-2xl border p-8 shadow-2xl ${modal.success ? "border-green-500/30 bg-[#0d1f17]" : "border-red-500/30 bg-[#1f0d0d]"}`}>
                        {/* Icon */}
                        <div className={`mx-auto mb-5 flex size-14 items-center justify-center rounded-full ${modal.success ? "bg-green-500/15" : "bg-red-500/15"}`}>
                            {modal.success ? (
                                <svg className="size-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="size-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        {/* Title */}
                        <h4 className={`font-hanken mb-2 text-center text-lg font-bold ${modal.success ? "text-green-400" : "text-red-400"}`}>
                            {modal.success ? "Registration Successful" : "Registration Failed"}
                        </h4>
                        {/* Message */}
                        <p className="mb-6 text-center text-sm leading-relaxed text-gray-300">
                            {modal.message}
                        </p>
                        {/* Actions */}
                        {modal.success ? (
                            <button
                                type="button"
                                onClick={() => { setModal(null); onSwitchToSignin?.(); }}
                                className="font-hanken w-full rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition hover:bg-green-400 active:scale-[0.98]"
                            >
                                Go to Sign In
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setModal(null)}
                                className="font-hanken w-full rounded-xl bg-red-500/20 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/30 active:scale-[0.98]"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            )}

            <form className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            {/* Avatar upload — full width */}
            <div className="col-span-1 mb-2 flex items-center gap-5 md:col-span-2">
                <div className="relative shrink-0">
                    <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600 bg-[#1A2333]">
                        {avatarSrc ? (
                            <Image
                                src={avatarSrc}
                                alt="Avatar"
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <svg
                                className="size-10 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="absolute right-0 bottom-0 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#1A2333] bg-[#A2BAF0] transition hover:scale-110"
                    >
                        <svg
                            className="size-3.5 text-[#001A42]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zm7-13H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4.2A2 2 0 0 0 19 2.2zM12 17.6A5.6 5.6 0 1 1 12 6.4a5.6 5.6 0 0 1 0 11.2z" />
                        </svg>
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={handleAvatar}
                    />
                </div>
                <div>
                    <p className="font-semibold text-gray-200">Trader Avatar</p>
                    <p className="text-sm text-gray-500">PNG or JPG. Max 5MB.</p>
                </div>
            </div>

            {/* Full Name */}
            <InputField
                label="Full Name"
                faicon={faUser}
            >
                <input type="text" placeholder="Alex Sterling" className={inputClass} onChange={e => setFormData((prev) => ({ ...prev, fullName: e.target.value }))} />
            </InputField>

            {/* Profession */}
            <InputField
                label="Profession"
                faicon={faSuitcase}
            >
                <input type="text" placeholder="Software Engineer" className={inputClass} onChange={e => setFormData((prev) => ({ ...prev, profession: e.target.value }))} />
                
            </InputField>

            {/* Email */}
            <InputField
                label="Email Address"
                faicon={faMailBulk}
            >
                <input type="email" placeholder="alex@portfolio-pulse.com" className={inputClass} onChange={e => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
            </InputField>

            {/* Date of Birth */}
            <InputField
                label="Date of Birth"
                faicon={faCalendar}
                    
            >
                <input type="date" className={inputClass} onChange={e => setFormData((prev) => ({ ...prev, dob: e.target.value }))} value={formData.dob} />
            </InputField>

            {/* Password */}
            <div className="flex flex-col gap-2">
                <label className="font-jetbrains text-xs font-semibold tracking-widest text-gray-400 uppercase">Password</label>
                <div className="flex items-center rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-2 focus-within:border-[#A2BAF0] focus-within:ring-1 focus-within:ring-[#A2BAF0]">
                    <FontAwesomeIcon icon={faLock} className="mr-3 shrink-0 text-gray-500" />
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={inputClass} onChange={e => setFormData((prev) => ({ ...prev, password: e.target.value }))} />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="ml-2 shrink-0 text-gray-500 hover:text-gray-300">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="size-4" />
                    </button>
                </div>
            </div>

            {/* Re-enter Password */}
            <div className="flex flex-col gap-2">
                <label className="font-jetbrains text-xs font-semibold tracking-widest text-gray-400 uppercase">Re-enter Password</label>
                <div className="flex items-center rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-2 focus-within:border-[#A2BAF0] focus-within:ring-1 focus-within:ring-[#A2BAF0]">
                    <FontAwesomeIcon icon={faLock} className="mr-3 shrink-0 text-gray-500" />
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className={inputClass} onChange={e => setConfirmPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="ml-2 shrink-0 text-gray-500 hover:text-gray-300">
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="size-4" />
                    </button>
                </div>
            </div>

            {/* Gender — full width */}
            <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
                <label className="font-jetbrains text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    Gender
                </label>
                <div className="flex gap-2">
                    {["male", "female", "other"].map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, gender: g }))}
                            className={`flex-1 cursor-pointer rounded-lg border py-2 text-sm font-medium transition ${
                                formData.gender === g
                                    ? "border-[#A2BAF0] bg-[#4D8EFF]/20 text-[#A2BAF0]"
                                    : "border-gray-700/40 bg-[#10131A] text-gray-500 hover:border-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* City */}
            <InputField
                label="City"
                faicon={faCity}
            >
                <input type="text" placeholder="London" className={inputClass} onChange={e => setFormData((prev) => ({ ...prev, address: { ...prev.address, city: e.target.value } }))} />
            </InputField>

            {/* Country */}
            <InputField
                label="Country"
                faicon={faGlobe}
            >
                <input type="text" placeholder="United Kingdom" className={inputClass} onChange={e => setFormData((prev) => ({ ...prev, address: { ...prev.address, country: e.target.value } }))} />
            </InputField>

            {/* Bio — full width */}
            <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
                <label className="font-jetbrains text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    Bio / Trading Strategy
                </label>
                <div className="flex items-start rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-3 focus-within:border-[#A2BAF0] focus-within:ring-1 focus-within:ring-[#A2BAF0]">
                    <svg
                        className="mt-0.5 mr-3 size-4 shrink-0 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    <textarea
                        rows={3}
                        placeholder="Briefly describe your trading style and long-term goals..."
                        className="w-full resize-none bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none md:text-base"
                        onChange={e => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="col-span-1 mt-2 space-y-4 md:col-span-2">
                {confirmPassword && formData.password !== confirmPassword && (
                    <p className="text-sm text-red-400">Passwords do not match</p>
                )}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={
                        loading ||
                        !!(confirmPassword && formData.password !== confirmPassword)
                    }
                    className="font-hanken flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#A2BAF0] py-4 text-base font-bold text-[#001A42] shadow-lg shadow-[#A2BAF0]/20 transition hover:bg-[#A2BAF0]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <Loader size="sm" color="border-[#001A42]" />
                    ) : (
                        <>
                            Start Trading
                            <FontAwesomeIcon icon={faArrowRight} className="size-4" />
                        </>
                    )}
                </button>
                <p className="text-center text-sm text-gray-400">
                    By registering, you agree to our{" "}
                    <a href="#" className="text-[#A2BAF0] hover:underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#A2BAF0] hover:underline">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </form>
        </>
    );
}
