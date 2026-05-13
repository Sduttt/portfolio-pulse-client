"use client";
import Loader from "@/app/components/Loader";
import {
    faChartLine,
    faThumbsUp,
    faThumbsDown,
    faPaperPlane,
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

type Props = {
    analysis: Analysis | null;
    analysisLoading: boolean;
    runningAnalysis: boolean;
    onRunAnalysis: () => void;
    onLikeClick: () => void;
    onDislikeClick: () => void;
    onFeedbackClick: () => void;
};

export default function AnalysisSection({
    analysis,
    analysisLoading,
    runningAnalysis,
    onRunAnalysis,
    onLikeClick,
    onDislikeClick,
    onFeedbackClick,
}: Props) {
    if (analysisLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader size="lg" color="border-[#4d8eff]" />
            </div>
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
                <p className="mb-3 font-mono text-xs tracking-wider text-gray-500 uppercase">
                    AI Feedback
                </p>
                <p className="leading-relaxed text-gray-300">{analysis.ai_feedback}</p>
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
