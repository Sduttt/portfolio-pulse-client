"use client";
import Loader from "@/app/components/Loader";
import { faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    feedbackResponse: "Like" | "Dislike" | "Neutral";
    feedbackText: string;
    submittingFeedback: boolean;
    onResponseChange: (r: "Like" | "Dislike" | "Neutral") => void;
    onTextChange: (text: string) => void;
    onSubmit: () => void;
    onClose: () => void;
};

export default function FeedbackModal({
    feedbackResponse,
    feedbackText,
    submittingFeedback,
    onResponseChange,
    onTextChange,
    onSubmit,
    onClose,
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#1d2027] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Leave Feedback</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="flex gap-2 mb-4">
                    {(["Like", "Neutral", "Dislike"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => onResponseChange(r)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${feedbackResponse === r ? "bg-[#4d8eff] text-[#001a42]" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <textarea
                    rows={4}
                    placeholder="Write your feedback about this analysis..."
                    value={feedbackText}
                    onChange={(e) => onTextChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#4d8eff]/50 resize-none mb-4"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 text-sm transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={submittingFeedback || !feedbackText.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4d8eff] text-[#001a42] font-bold text-sm hover:scale-105 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submittingFeedback ? <Loader size="sm" color="border-[#001a42]" /> : <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />}
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
