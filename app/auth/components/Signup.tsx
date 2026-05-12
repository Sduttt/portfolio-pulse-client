"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef, useState } from "react";
import InputField, { inputClass } from "./InputField";

export default function Signup() {
    const [gender, setGender] = useState<string>("");
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatarSrc(URL.createObjectURL(file));
    };

    return (
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
                icon={
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                }
            >
                <input type="text" placeholder="Alex Sterling" className={inputClass} />
            </InputField>

            {/* Profession */}
            <InputField
                label="Profession"
                icon={
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zm8 16H4V8h16v12z" />
                    </svg>
                }
            >
                <input type="text" placeholder="Software Engineer" className={inputClass} />
                
            </InputField>

            {/* Email */}
            <InputField
                label="Email Address"
                icon={
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                }
            >
                <input type="email" placeholder="alex@portfolio-pulse.com" className={inputClass} />
            </InputField>

            {/* Date of Birth */}
            <InputField
                label="Date of Birth"
                icon={
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                    </svg>
                }
            >
                <input type="date" className={inputClass} />
            </InputField>

            {/* Password */}
            <InputField
                label="Password"
                icon={
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z" />
                    </svg>
                }
            >
                <input type="password" placeholder="••••••••" className={inputClass} />
            </InputField>

            {/* Re-enter Password */}
            <InputField
                label="Re-enter Password"
                icon={
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z" />
                    </svg>
                }
            >
                <input type="password" placeholder="••••••••" className={inputClass} />
            </InputField>

            {/* Gender — full width */}
            <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
                <label className="font-jetbrains text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    Gender
                </label>
                <div className="flex gap-2">
                    {["Male", "Female", "Other"].map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                                gender === g
                                    ? "border-[#A2BAF0] bg-[#4D8EFF]/20 text-[#A2BAF0]"
                                    : "border-gray-700/40 bg-[#10131A] text-gray-500 hover:border-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* City */}
            <InputField
                label="City"
                icon={
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                    </svg>
                }
            >
                <input type="text" placeholder="London" className={inputClass} />
            </InputField>

            {/* Country */}
            <InputField
                label="Country"
                icon={
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                }
            >
                <input type="text" placeholder="United Kingdom" className={inputClass} />
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
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="col-span-1 mt-2 space-y-4 md:col-span-2">
                <button
                    type="submit"
                    className="font-hanken flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#A2BAF0] py-4 text-base font-bold text-[#001A42] shadow-lg shadow-[#A2BAF0]/20 transition hover:bg-[#A2BAF0]/90 active:scale-[0.98]"
                >
                    Start Trading
                    <FontAwesomeIcon icon={faArrowRight} className="size-4" />
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
    );
}
