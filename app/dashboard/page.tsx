"use client";
import { useEffect, useState } from "react";
import { tradeApi } from "@/lib/api/trade";
import TradesTable from "./components/TradesTable";
import Loader from "../components/Loader";
import TradeFormModal from "@/app/trade/components/TradeFormModal";
import { TradeFormData } from "@/app/trade/components/TradeForm";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Dashboard = () => {
    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addModal, setAddModal] = useState(false);

    const fetchTrades = async () => {
        try {
            const res = await tradeApi.getAll();
            setTrades(res.data.data ?? []);
        } catch (err) {
            console.error("Error fetching trades:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrade = async (data: TradeFormData) => {
        await tradeApi.create(data);
        setAddModal(false);
        void fetchTrades();
    };

    useEffect(() => {
        void fetchTrades();
        // Re-fetch when user navigates back to this tab/page
        const onFocus = () => void fetchTrades();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    return (
        <div className="min-h-[80vh] px-4 py-12 md:px-10">
            {loading ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <Loader size="lg" color="border-[#4d8eff]" />
                </div>
            ) : trades.length > 0 ? (
                <TradesTable trades={trades} onTradeAdded={fetchTrades} />
            ) : (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
                    <p className="text-center text-gray-500">
                        No trades found. Start by creating a new trade!
                    </p>
                    <button
                        onClick={() => setAddModal(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#4d8eff] px-6 py-3 text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        Add Trade
                    </button>
                </div>
            )}

            {addModal && (
                <TradeFormModal
                    mode="add"
                    onSubmit={handleAddTrade}
                    onClose={() => setAddModal(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
