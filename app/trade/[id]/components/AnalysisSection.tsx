"use client";
import { useState } from "react";
import Loader from "@/app/components/Loader";
import StripeTestModal from "@/app/components/StripeTestModal";
import { subscriptionApi } from "@/lib/api/subscription";
import {
    faChartLine,
    faThumbsUp,
    faThumbsDown,
    faPaperPlane,
    faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScoreRing from "./ScoreRing";
import { Analysis } from "../types";

function sentimentColor(s: string) {
    const l = s?.toLowerCase();
    if (l === "greed" || l === "bearish") return "text-[#ff5451]";
    if (l === "fear") return "text-[#ffb3ad]";
    if (l === "bullish") return "text-[#4edea3]";
    return "text-[#adc6ff]";
}

function parseFeedback(feedback: string): { label: string | null; text: string }[] {
    // Split on "- " that precedes a capitalised word (the label)
    const parts = feedback.split(/\s*-\s+(?=[A-Z])/).filter(Boolean);
    if (parts.length <= 1) return [{ label: null, text: feedback.trim() }];
    return parts.map((part) => {
        const colonIdx = part.indexOf(":");
        if (colonIdx === -1) return { label: null, text: part.trim() };
        return {
            label: part.slice(0, colonIdx).trim(),
            text: part.slice(colonIdx + 1).trim(),
        };
    });
}

type Props = {
    analysis: Analysis | null;
    analysisLoading: boolean;
    runningAnalysis: boolean;
    subscriptionRequired: boolean;
    onRunAnalysis: () => void;
    onLikeClick: () => void;
    onDislikeClick: () => void;
    onFeedbackClick: () => void;
};

export default function AnalysisSection({
    analysis,
    analysisLoading,
    runningAnalysis,
    subscriptionRequired,
    onRunAnalysis,
    onLikeClick,
    onDislikeClick,
    onFeedbackClick,
}: Props) {
    const [showStripeModal, setShowStripeModal] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const res = await subscriptionApi.createCheckoutSession();
            const url: string = res.data?.url ?? res.data?.checkoutUrl ?? res.data;
            if (url) window.location.href = url;
        } catch (err: any) {
            setShowStripeModal(false);
            setCheckoutError(
                err.response?.data?.message ?? "Failed to start checkout. Please try again."
            );
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (analysisLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader size="lg" color="border-[#4d8eff]" />
            </div>
        );
    }

    if (subscriptionRequired) {
        return (
            <>
                {showStripeModal && (
                    <StripeTestModal
                        onClose={() => setShowStripeModal(false)}
                        onProceed={handleCheckout}
                        loading={checkoutLoading}
                    />
                )}
                <div className="flex flex-col items-center gap-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10">
                        <FontAwesomeIcon icon={faCrown} className="text-xl text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Pro Feature</h3>
                        <p className="mt-1 max-w-sm text-sm text-gray-400">
                            AI trade analysis requires an active Pulse Pro subscription. Upgrade to
                            unlock rationality scores, sentiment analysis, and actionable feedback.
                        </p>
                    </div>
                    {checkoutError && <p className="text-xs text-red-400">{checkoutError}</p>}
                    <button
                        onClick={() => {
                            setCheckoutError(null);
                            setShowStripeModal(true);
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#4d8eff] px-6 py-3 text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100"
                    >
                        <FontAwesomeIcon icon={faCrown} />
                        Upgrade to Pro — ₹49/mo
                    </button>
                </div>
            </>
        );
    }

    if (!analysis) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/8 bg-[#1a1d27]/80 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4d8eff]/10">
                    <FontAwesomeIcon icon={faChartLine} className="text-xl text-[#adc6ff]" />
                </div>
                <h3 className="text-lg font-semibold text-white">No Analysis Yet</h3>
                <p className="max-w-sm text-sm text-gray-500">
                    Run AI analysis on this trade to get a rationality score, sentiment, and
                    actionable feedback.
                </p>
                <button
                    onClick={onRunAnalysis}
                    disabled={runningAnalysis}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#4d8eff] px-6 py-3 text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {runningAnalysis ? (
                        <Loader size="sm" color="border-[#001a42]" />
                    ) : (
                        <FontAwesomeIcon icon={faChartLine} />
                    )}
                    {runningAnalysis ? "Analysing..." : "Analyse Trade"}
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/8 bg-[#1a1d27]/80 p-6 md:p-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4d8eff]/20">
                    <FontAwesomeIcon icon={faChartLine} className="text-sm text-[#adc6ff]" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Analysis</h2>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-transparent bg-white/3 p-6 transition-all hover:border-white/10 hover:bg-white/6">
                    <p className="font-mono text-xs tracking-wider text-gray-500 uppercase">
                        Rationality Score
                    </p>
                    <ScoreRing score={analysis.rationalityScore} />
                    <p className="text-xs text-gray-400">
                        {analysis.rationalityScore >= 70
                            ? "High Logic"
                            : analysis.rationalityScore >= 40
                              ? "Moderate"
                              : "Impulsive"}
                    </p>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-transparent bg-white/3 p-6 transition-all hover:border-white/10 hover:bg-white/6">
                    <p className="mb-2 font-mono text-xs tracking-wider text-gray-500 uppercase">
                        AI Sentiment
                    </p>
                    <span
                        className={`text-4xl font-bold tracking-tight ${sentimentColor(analysis.sentiment)}`}
                    >
                        {analysis.sentiment}
                    </span>
                    <p className="mt-auto text-xs text-gray-500">
                        Analysed{" "}
                        {new Date(analysis.createdAt ?? "").toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            <div className="mb-8 rounded-xl border border-transparent bg-white/3 p-6 transition-all hover:border-white/10 hover:bg-white/6">
                <p className="mb-4 font-mono text-xs tracking-wider text-gray-500 uppercase">
                    AI Feedback
                </p>
                {(() => {
                    const items = parseFeedback(analysis.ai_feedback ?? "");
                    if (items.length === 1 && !items[0].label) {
                        return (
                            <p className="text-sm leading-relaxed text-gray-300">{items[0].text}</p>
                        );
                    }
                    return (
                        <ul className="flex flex-col gap-4">
                            {items.map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d8eff]" />
                                    <p className="text-sm leading-relaxed text-gray-300">
                                        {item.label && (
                                            <span className="font-semibold text-[#adc6ff]">
                                                {item.label}:{" "}
                                            </span>
                                        )}
                                        {item.text}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    );
                })()}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">Was this analysis helpful?</span>
                    <button
                        onClick={onLikeClick}
                        className={`cursor-pointer rounded-lg p-2 transition-colors ${
                            analysis.users_response_to_ai === "Like"
                                ? "bg-[#4edea3]/15 text-[#4edea3]"
                                : "bg-white/5 text-gray-400 hover:bg-[#4edea3]/10 hover:text-[#4edea3]"
                        }`}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    <button
                        onClick={onDislikeClick}
                        className={`cursor-pointer rounded-lg p-2 transition-colors ${
                            analysis.users_response_to_ai === "Dislike"
                                ? "bg-[#ff5451]/15 text-[#ff5451]"
                                : "bg-white/5 text-gray-400 hover:bg-[#ff5451]/10 hover:text-[#ff5451]"
                        }`}
                    >
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </button>
                </div>
                <button
                    onClick={onFeedbackClick}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/10"
                >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                    Leave Feedback
                </button>
            </div>
        </div>
    );
}
