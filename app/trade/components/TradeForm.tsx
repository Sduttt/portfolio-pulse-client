"use client";
import Loader from "@/app/components/Loader";
import {
    faTag,
    faHashtag,
    faArrowUp,
    faArrowDown,
    faLayerGroup,
    faCoins,
    faCalendar,
    faBrain,
    faFloppyDisk,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";

type Suggestion = {
    symbol: string;
    name: string;
    currency: string;
    exchangeFullName: string;
    exchange: string;
};

export type TradeFormData = {
    assetName: string;
    ticker: string;
    tradeType: "Buy" | "Sell";
    quantity: number | "";
    currency: string;
    pricePerUnit: number | "";
    tradeDate: string;
    reason: string;
};

type Props = {
    mode: "add" | "edit";
    initialData?: Partial<TradeFormData>;
    onSubmit: (data: TradeFormData) => Promise<void>;
    onCancel: () => void;
};

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD", "JPY"];

const EMPTY: TradeFormData = {
    assetName: "",
    ticker: "",
    tradeType: "Buy",
    quantity: "",
    currency: "INR",
    pricePerUnit: "",
    tradeDate: new Date().toISOString().split("T")[0],
    reason: "",
};

const inputClass =
    "w-full bg-[#0b0e15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#4d8eff]/50 transition-all";

export default function TradeForm({ mode, initialData, onSubmit, onCancel }: Props) {
    const [form, setForm] = useState<TradeFormData>({ ...EMPTY, ...initialData });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof TradeFormData, string>>>({});
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [suggestionsFor, setSuggestionsFor] = useState<"assetName" | "ticker" | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const set = <K extends keyof TradeFormData>(key: K, value: TradeFormData[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const searchAssets = async (query: string, field: "assetName" | "ticker") => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            setSuggestionsFor(null);
            return;
        }
        setSearchLoading(true);
        try {
            const res = await fetch(`/api/search-asset?query=${encodeURIComponent(query.trim())}`);
            const data: Suggestion[] = await res.json();
            setSuggestions(data);
            setSuggestionsFor(field);
        } catch {
            setSuggestions([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearchInput = (value: string, field: "assetName" | "ticker") => {
        if (field === "assetName") set("assetName", value);
        else set("ticker", value.toUpperCase());
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => void searchAssets(value, field), 350);
    };

    const selectSuggestion = (s: Suggestion) => {
        setForm((prev) => ({
            ...prev,
            assetName: s.name,
            ticker: s.symbol,
            currency: ["INR", "USD", "EUR", "GBP", "AED", "SGD", "JPY"].includes(s.currency)
                ? s.currency
                : prev.currency,
        }));
        setErrors((prev) => ({ ...prev, assetName: undefined, ticker: undefined }));
        setSuggestions([]);
        setSuggestionsFor(null);
    };

    const dismissSuggestions = () => {
        setTimeout(() => {
            setSuggestions([]);
            setSuggestionsFor(null);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const validate = (): boolean => {
        const e: Partial<Record<keyof TradeFormData, string>> = {};
        if (!form.assetName.trim()) e.assetName = "Asset name is required";
        if (!form.ticker.trim()) e.ticker = "Ticker is required";
        if (form.quantity === "" || Number(form.quantity) <= 0)
            e.quantity = "Enter a valid quantity";
        if (form.pricePerUnit === "" || Number(form.pricePerUnit) <= 0)
            e.pricePerUnit = "Enter a valid price";
        if (!form.tradeDate) {
            e.tradeDate = "Trade date is required";
        } else if (form.tradeDate > new Date().toISOString().split("T")[0]) {
            e.tradeDate = "Trade date cannot be in the future";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await onSubmit({
                ...form,
                quantity: Number(form.quantity),
                pricePerUnit: Number(form.pricePerUnit),
            });
        } finally {
            setSubmitting(false);
        }
    };

    const total =
        form.quantity !== "" && form.pricePerUnit !== ""
            ? (Number(form.quantity) * Number(form.pricePerUnit)).toLocaleString()
            : "—";

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="rounded-2xl border border-white/8 bg-[#1a1d27]/80 p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <p className="mb-1 font-mono text-xs tracking-widest text-[#adc6ff] uppercase">
                        {mode === "add" ? "New Trade" : "Update Trade"}
                    </p>
                    <h1 className="text-2xl font-bold text-white">
                        {mode === "add" ? "Add a New Trade" : "Update Trade Details"}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {mode === "add"
                            ? "Record a new buy or sell transaction in your portfolio."
                            : "Modify existing trade parameters. Changes reflect across all analytics."}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Asset Name */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-[#adc6ff] uppercase">
                            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                            Asset Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. Reliance Industries"
                                value={form.assetName}
                                onChange={(e) => handleSearchInput(e.target.value, "assetName")}
                                onBlur={dismissSuggestions}
                                className={inputClass}
                                autoComplete="off"
                            />
                            {searchLoading && suggestionsFor === "assetName" && (
                                <span className="absolute top-1/2 right-3 -translate-y-1/2 animate-pulse text-[10px] text-gray-500">
                                    searching…
                                </span>
                            )}
                            {suggestionsFor === "assetName" && suggestions.length > 0 && (
                                <SuggestionDropdown
                                    suggestions={suggestions}
                                    onSelect={selectSuggestion}
                                />
                            )}
                        </div>
                        {errors.assetName && (
                            <p className="text-xs text-[#ff5451]">{errors.assetName}</p>
                        )}
                    </div>

                    {/* Ticker */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-[#adc6ff] uppercase">
                            <FontAwesomeIcon icon={faHashtag} className="text-[10px]" />
                            Ticker Symbol
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. RELIANCE"
                                value={form.ticker}
                                onChange={(e) => handleSearchInput(e.target.value, "ticker")}
                                onBlur={dismissSuggestions}
                                className={`${inputClass} font-mono tracking-widest`}
                                autoComplete="off"
                            />
                            {searchLoading && suggestionsFor === "ticker" && (
                                <span className="absolute top-1/2 right-3 -translate-y-1/2 animate-pulse text-[10px] text-gray-500">
                                    searching…
                                </span>
                            )}
                            {suggestionsFor === "ticker" && suggestions.length > 0 && (
                                <SuggestionDropdown
                                    suggestions={suggestions}
                                    onSelect={selectSuggestion}
                                />
                            )}
                        </div>
                        {errors.ticker && <p className="text-xs text-[#ff5451]">{errors.ticker}</p>}
                    </div>

                    {/* Trade Type */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-[#adc6ff] uppercase">
                            Trade Type
                        </label>
                        <div className="flex w-full max-w-xs rounded-xl border border-white/10 bg-[#0b0e15] p-1">
                            <button
                                type="button"
                                onClick={() => set("tradeType", "Buy")}
                                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                                    form.tradeType === "Buy"
                                        ? "bg-[#00a572]/20 text-[#4edea3] shadow-sm"
                                        : "text-gray-500 hover:text-gray-300"
                                }`}
                            >
                                <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
                                Buy
                            </button>
                            <button
                                type="button"
                                onClick={() => set("tradeType", "Sell")}
                                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                                    form.tradeType === "Sell"
                                        ? "bg-[#ff5451]/20 text-[#ffb3ad] shadow-sm"
                                        : "text-gray-500 hover:text-gray-300"
                                }`}
                            >
                                <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
                                Sell
                            </button>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-[#adc6ff] uppercase">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-[10px]" />
                            Quantity
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0"
                                min="0"
                                step="0.01"
                                value={form.quantity}
                                onChange={(e) =>
                                    set(
                                        "quantity",
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className={`${inputClass} pr-16 font-mono`}
                            />
                            <span className="absolute top-1/2 right-4 -translate-y-1/2 font-mono text-xs text-gray-500">
                                UNITS
                            </span>
                        </div>
                        {errors.quantity && (
                            <p className="text-xs text-[#ff5451]">{errors.quantity}</p>
                        )}
                    </div>

                    {/* Price per unit */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-[#adc6ff] uppercase">
                            <FontAwesomeIcon icon={faCoins} className="text-[10px]" />
                            Price per Unit
                        </label>
                        <div className="flex gap-2">
                            {/* Currency select */}
                            <select
                                value={form.currency}
                                onChange={(e) => set("currency", e.target.value)}
                                className="cursor-pointer rounded-xl border border-white/10 bg-[#0b0e15] px-3 py-3 font-mono text-sm text-white focus:ring-1 focus:ring-[#4d8eff]/50 focus:outline-none"
                            >
                                {CURRENCIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                value={form.pricePerUnit}
                                onChange={(e) =>
                                    set(
                                        "pricePerUnit",
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className={`${inputClass} flex-1 font-mono`}
                            />
                        </div>
                        {errors.pricePerUnit && (
                            <p className="text-xs text-[#ff5451]">{errors.pricePerUnit}</p>
                        )}
                    </div>

                    {/* Trade Date */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-[#adc6ff] uppercase">
                            <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                            Trade Date
                        </label>
                        <input
                            type="date"
                            value={form.tradeDate}
                            onChange={(e) => set("tradeDate", e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className={`${inputClass} scheme-dark`}
                        />
                        {errors.tradeDate && (
                            <p className="text-xs text-[#ff5451]">{errors.tradeDate}</p>
                        )}
                    </div>

                    {/* Total (computed, read-only) */}
                    <div className="space-y-1.5">
                        <label className="font-mono text-xs tracking-wider text-gray-500 uppercase">
                            Estimated Total
                        </label>
                        <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3 font-mono font-semibold text-white">
                            {form.currency} {total}
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-[#adc6ff] uppercase">
                            <FontAwesomeIcon icon={faBrain} className="text-[10px]" />
                            Trade Reason
                            <span className="ml-1 font-sans tracking-normal text-gray-600 normal-case">
                                (optional)
                            </span>
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Why did you make this trade? e.g. Bull run started, RSI oversold..."
                            value={form.reason}
                            onChange={(e) => set("reason", e.target.value)}
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col justify-end gap-3 border-t border-white/8 pt-6 sm:flex-row">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 px-6 py-3 text-sm text-gray-400 transition-all hover:bg-white/10"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-xs" />
                        {mode === "add" ? "Cancel" : "Discard Changes"}
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4d8eff] px-8 py-3 text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? (
                            <Loader size="sm" color="border-[#001a42]" />
                        ) : (
                            <FontAwesomeIcon icon={faFloppyDisk} />
                        )}
                        {submitting
                            ? mode === "add"
                                ? "Adding..."
                                : "Saving..."
                            : mode === "add"
                              ? "Add Trade"
                              : "Save Changes"}
                    </button>
                </div>
            </div>
        </form>
    );
}

function SuggestionDropdown({
    suggestions,
    onSelect,
}: {
    suggestions: Suggestion[];
    onSelect: (s: Suggestion) => void;
}) {
    return (
        <ul className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-hidden overflow-y-auto rounded-xl border border-white/10 bg-[#1a1d27] shadow-2xl shadow-black/60">
            {suggestions.map((s) => (
                <li key={s.symbol}>
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onSelect(s);
                        }}
                        className="group flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#4d8eff]/10"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{s.name}</p>
                            <p className="truncate text-xs text-gray-500">{s.exchangeFullName}</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="font-mono text-xs text-[#adc6ff] group-hover:text-[#4d8eff]">
                                {s.symbol}
                            </p>
                            <p className="text-[10px] text-gray-600">{s.currency}</p>
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
}
