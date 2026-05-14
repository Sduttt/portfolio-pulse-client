"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faCopy,
    faCheck,
    faCreditCard,
    faLock,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";

interface Props {
    onClose: () => void;
    onProceed: () => void;
    loading?: boolean;
}

const CARD_NUMBER = "4242 4242 4242 4242";

interface FieldRowProps {
    label: string;
    value: string;
    hint?: string;
    copyable?: boolean;
}

function FieldRow({ label, value, hint, copyable }: FieldRowProps) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(value.replace(/\s/g, ""));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-3">
            <div className="flex flex-col gap-0.5">
                <span className="font-jetbrains text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                    {label}
                </span>
                <span className="font-jetbrains text-sm text-gray-200">{value}</span>
                {hint && <span className="text-[11px] text-gray-600">{hint}</span>}
            </div>
            {copyable && (
                <button
                    onClick={copy}
                    title="Copy to clipboard"
                    className="ml-4 shrink-0 cursor-pointer rounded-md border border-gray-700/40 bg-[#1d2027] px-3 py-1.5 text-xs text-gray-400 transition-all hover:border-[#4d8eff]/50 hover:text-[#adc6ff] active:scale-95"
                >
                    {copied ? (
                        <span className="flex items-center gap-1.5 text-green-400">
                            <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                            Copied
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
                            Copy
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}

export default function StripeTestModal({ onClose, onProceed, loading = false }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-700/40 bg-[#1d2027] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-700/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4d8eff]/15">
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                className="text-sm text-[#4d8eff]"
                            />
                        </div>
                        <div>
                            <h2 className="font-hanken text-sm font-bold text-gray-100">
                                Test Payment Details
                            </h2>
                            <p className="text-[11px] text-gray-500">
                                Stripe test mode — no real charge
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-700/40 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-3 px-6 py-5">
                    {/* Info banner */}
                    <div className="flex items-start gap-3 rounded-lg border border-[#4d8eff]/20 bg-[#4d8eff]/8 px-4 py-3">
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="mt-0.5 shrink-0 text-sm text-[#4d8eff]"
                        />
                        <p className="text-xs leading-relaxed text-gray-400">
                            This is running in Stripe&nbsp;
                            <span className="font-semibold text-[#adc6ff]">test mode</span>. Use the
                            card details below — no real money will be charged.
                        </p>
                    </div>

                    {/* Card details */}
                    <FieldRow label="Card Number" value={CARD_NUMBER} copyable />
                    <div className="grid grid-cols-2 gap-3">
                        <FieldRow
                            label="Expiry Date"
                            value="12 / 28"
                            hint="Any future date works"
                        />
                        <FieldRow label="CVV" value="123" hint="Any 3 digits work" />
                    </div>
                    <FieldRow label="Cardholder Name" value="Test User" hint="Any name works" />
                    <FieldRow
                        label="ZIP / Postal Code"
                        value="12345"
                        hint="Any valid postal code works"
                    />

                    {/* Lock note */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-600">
                        <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                        Payments are processed securely by Stripe
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 border-t border-gray-700/30 px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="font-hanken flex-1 cursor-pointer rounded-xl border border-gray-700/40 bg-transparent py-2.5 text-sm font-semibold text-gray-400 transition-all hover:bg-gray-700/30 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onProceed}
                        disabled={loading}
                        className="font-hanken flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4d8eff] py-2.5 text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <Loader size="sm" color="border-[#001a42]" />
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCreditCard} />
                                Continue to Checkout
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
