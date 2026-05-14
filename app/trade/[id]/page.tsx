"use client";
import { tradeApi } from "@/lib/api/trade";
import Loader from "@/app/components/Loader";
import { faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trade, Analysis } from "./types";
import TradeCard from "./components/TradeCard";
import AnalysisSection from "./components/AnalysisSection";
import FeedbackModal from "./components/FeedbackModal";
import DeleteModal from "./components/DeleteModal";
import TradeFormModal from "@/app/trade/components/TradeFormModal";
import { TradeFormData } from "@/app/trade/components/TradeForm";

export default function TradePage() {
    const params = useParams();
    const router = useRouter();
    const tradeId = params.id as string;

    const [trade, setTrade] = useState<Trade | null>(null);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [tradeLoading, setTradeLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(true);
    const [runningAnalysis, setRunningAnalysis] = useState(false);
    const [subscriptionRequired, setSubscriptionRequired] = useState(false);

    const [feedbackModal, setFeedbackModal] = useState(false);
    const [feedbackResponse, setFeedbackResponse] = useState<"Like" | "Dislike" | "Neutral">(
        "Neutral"
    );
    const [feedbackText, setFeedbackText] = useState("");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        // Pre-check subscription status from localStorage to avoid unnecessary API call
        try {
            const stored = localStorage.getItem("profile");
            if (stored) {
                const profile = JSON.parse(stored).data;
                if (profile?.subscriptionStatus === false) {
                    setSubscriptionRequired(true);
                    setAnalysisLoading(false);
                }
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        const fetchTrade = async () => {
            try {
                const res = await tradeApi.getById(tradeId);
                setTrade(res.data.data);
            } catch (err) {
                console.error("Error fetching trade:", err);
            } finally {
                setTradeLoading(false);
            }
        };

        const fetchAnalysis = async () => {
            try {
                const res = await tradeApi.getAnalysis(tradeId);
                setAnalysis(res.data.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const msg: string = err.response?.data?.message ?? "";
                    if (
                        err.response?.status === 403 ||
                        msg.toLowerCase().includes("subscription")
                    ) {
                        setSubscriptionRequired(true);
                    } else if (err.response?.status !== 404) {
                        console.error("Error fetching analysis:", err);
                    }
                }
            } finally {
                setAnalysisLoading(false);
            }
        };

        void fetchTrade();
        void fetchAnalysis();
    }, [tradeId]);

    const handleRunAnalysis = async () => {
        setRunningAnalysis(true);
        try {
            const res = await tradeApi.runAnalysis(tradeId);
            setAnalysis(res.data.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const msg: string = err.response?.data?.message ?? "";
                if (
                    err.response?.status === 403 ||
                    msg.toLowerCase().includes("subscription")
                ) {
                    setSubscriptionRequired(true);
                } else {
                    console.error("Error running analysis:", err);
                }
            }
        } finally {
            setRunningAnalysis(false);
        }
    };

    const handleFeedbackSubmit = async () => {
        if (!analysis) return;
        setSubmittingFeedback(true);
        try {
            await tradeApi.submitFeedback(tradeId, {
                users_response_to_ai: feedbackResponse,
                users_feedback: feedbackText,
            });
            const res = await tradeApi.getAnalysis(tradeId);
            setAnalysis(res.data.data);
            setFeedbackModal(false);
            setFeedbackText("");
            showToast("Feedback submitted!");
        } catch (err) {
            console.error("Error submitting feedback:", err);
            showToast("Failed to submit feedback.");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await tradeApi.delete(tradeId);
            window.location.href = "/dashboard";
        } catch (err) {
            console.error("Error deleting trade:", err);
            showToast("Failed to delete trade.");
            setDeleting(false);
            setDeleteModal(false);
        }
    };

    const handleEditTrade = async (data: TradeFormData) => {
        await tradeApi.update(tradeId, data);
        const res = await tradeApi.getById(tradeId);
        setTrade(res.data.data);
        setEditModal(false);
        showToast("Trade updated successfully!");
    };

    return (
        <div className="mx-auto min-h-[80vh] max-w-5xl px-4 py-10 md:px-10">
            {toast && (
                <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-white/10 bg-[#1d2027] px-5 py-3 text-sm text-white shadow-2xl">
                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs text-[#4d8eff]" />
                    {toast}
                </div>
            )}

            <button
                onClick={() => router.push("/dashboard")}
                className="mb-8 flex cursor-pointer items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Dashboard
            </button>

            {tradeLoading ? (
                <div className="flex justify-center py-16">
                    <Loader size="lg" color="border-[#4d8eff]" />
                </div>
            ) : trade ? (
                <TradeCard
                    trade={trade}
                    tradeId={tradeId}
                    onDeleteClick={() => setDeleteModal(true)}
                    onEditClick={() => setEditModal(true)}
                />
            ) : (
                <p className="mb-6 text-gray-500">Trade not found.</p>
            )}

            <AnalysisSection
                analysis={analysis}
                analysisLoading={analysisLoading}
                runningAnalysis={runningAnalysis}
                subscriptionRequired={subscriptionRequired}
                onRunAnalysis={handleRunAnalysis}
                onLikeClick={() => {
                    setFeedbackResponse("Like");
                    setFeedbackModal(true);
                }}
                onDislikeClick={() => {
                    setFeedbackResponse("Dislike");
                    setFeedbackModal(true);
                }}
                onFeedbackClick={() => {
                    setFeedbackResponse("Neutral");
                    setFeedbackModal(true);
                }}
            />

            {feedbackModal && (
                <FeedbackModal
                    feedbackResponse={feedbackResponse}
                    feedbackText={feedbackText}
                    submittingFeedback={submittingFeedback}
                    onResponseChange={setFeedbackResponse}
                    onTextChange={setFeedbackText}
                    onSubmit={handleFeedbackSubmit}
                    onClose={() => setFeedbackModal(false)}
                />
            )}

            {deleteModal && (
                <DeleteModal
                    assetName={trade?.assetName}
                    deleting={deleting}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteModal(false)}
                />
            )}

            {editModal && trade && (
                <TradeFormModal
                    mode="edit"
                    initialData={trade}
                    onSubmit={handleEditTrade}
                    onClose={() => setEditModal(false)}
                />
            )}
        </div>
    );
}
