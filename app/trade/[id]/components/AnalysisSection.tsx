"use client";
import Loader from "@/app/components/Loader";
import { faChartLine, faThumbsUp, faThumbsDown, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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
            <div className="bg-[#1a1d27]/80 border border-white/8 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-[#4d8eff]/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartLine} className="text-[#adc6ff] text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-white">No Analysis Yet</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    Run AI analysis on this trade to get a rationality score, sentiment, and actionable feedback.
                </p>
                <button
                    onClick={onRunAnalysis}
                    disabled={runningAnalysis}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4d8eff] text-[#001a42] font-bold text-sm shadow-lg shadow-[#4d8eff]/20 hover:scale-105 active:scale-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {runningAnalysis ? <Loader size="sm" color="border-[#001a42]" /> : <FontAwesomeIcon icon={faChartLine} />}
                    {runningAnalysis ? "Analysing..." : "Analyse Trade"}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1d27]/80 border border-white/8 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#4d8eff]/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartLine} className="text-[#adc6ff] text-sm" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Analysis</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/3 hover:bg-white/6 border border-transparent hover:border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 transition-all">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">Rationality Score</p>
                    <ScoreRing score={analysis.rationalityScore} />
                    <p className="text-xs text-gray-400">
                        {analysis.rationalityScore >= 70 ? "High Logic" : analysis.rationalityScore >= 40 ? "Moderate" : "Impulsive"}
                    </p>
                </div>

                <div className="bg-white/3 hover:bg-white/6 border border-transparent hover:border-white/10 rounded-xl p-6 flex flex-col gap-2 transition-all">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-2">AI Sentiment</p>
                    <span className={`text-4xl font-bold tracking-tight ${sentimentColor(analysis.sentiment)}`}>
                        {analysis.sentiment}
                    </span>
                    <p className="text-xs text-gray-500 mt-auto">
                        Analysed {new Date(analysis.createdAt ?? "").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                </div>
            </div>

            <div className="bg-white/3 hover:bg-white/6 border border-transparent hover:border-white/10 rounded-xl p-6 mb-8 transition-all">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-3">AI Feedback</p>
                <p className="text-gray-300 leading-relaxed">{analysis.ai_feedback}</p>
            </div>

            <div className="border-t border-white/8 pt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">Was this analysis helpful?</span>
                    <button
                        onClick={onLikeClick}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            analysis.users_response_to_ai === "Like"
                                ? "bg-[#4edea3]/15 text-[#4edea3]"
                                : "bg-white/5 text-gray-400 hover:bg-[#4edea3]/10 hover:text-[#4edea3]"
                        }`}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    <button
                        onClick={onDislikeClick}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
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
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 text-sm transition-all cursor-pointer"
                >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                    Leave Feedback
                </button>
            </div>
        </div>
    );
}
