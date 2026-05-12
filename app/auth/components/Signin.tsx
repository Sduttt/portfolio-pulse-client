"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputField, { inputClass } from "./InputField";

export default function Signin() {
    return (
        <form className="flex flex-col gap-5">
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

            {/* Forgot password */}
            <div className="flex justify-end">
                <a href="#" className="text-sm text-[#A2BAF0] hover:underline">
                    Forgot password?
                </a>
            </div>

            {/* Submit */}
            <div className="mt-2 space-y-4">
                <button
                    type="submit"
                    className="font-hanken flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#A2BAF0] py-4 text-base font-bold text-[#001A42] shadow-lg shadow-[#A2BAF0]/20 transition hover:bg-[#A2BAF0]/90 active:scale-[0.98]"
                >
                    Sign In
                    <FontAwesomeIcon icon={faArrowRight} className="size-4" />
                </button>
                <p className="text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <button type="button" className="cursor-pointer text-[#A2BAF0] hover:underline">
                        Create one
                    </button>
                </p>
            </div>
        </form>
    );
}
