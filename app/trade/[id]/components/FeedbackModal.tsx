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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1d2027] p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Leave Feedback</h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-500 transition-colors hover:text-white"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="mb-4 flex gap-2">
                    {(["Like", "Neutral", "Dislike"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => onResponseChange(r)}
                            className={`flex-1 cursor-pointer rounded-xl py-2 text-sm font-medium transition-all ${feedbackResponse === r ? "bg-[#4d8eff] text-[#001a42]" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
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
                    className="mb-4 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-[#4d8eff]/50 focus:outline-none"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 cursor-pointer rounded-xl bg-white/5 py-2.5 text-sm text-gray-400 transition-all hover:bg-white/10"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={submittingFeedback || !feedbackText.trim()}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4d8eff] py-2.5 text-sm font-bold text-[#001a42] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submittingFeedback ? (
                            <Loader size="sm" color="border-[#001a42]" />
                        ) : (
                            <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                        )}
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
