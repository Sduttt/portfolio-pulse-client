"use client";
import { faArrowUp, faArrowDown, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Trade } from "../types";

type Props = {
    trade: Trade;
    tradeId: string;
    onDeleteClick: () => void;
    onEditClick: () => void;
};

export default function TradeCard({ trade, tradeId, onDeleteClick, onEditClick }: Props) {
    const isBuy = trade.tradeType === "Buy";
    const total = trade.quantity * trade.pricePerUnit;

    return (
        <div className="bg-[#1a1d27]/80 border border-white/8 rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{trade.assetName}</h1>
                    <span className="text-xs font-mono text-[#adc6ff] bg-[#4d8eff]/10 px-2 py-1 rounded-md">
                        {trade.ticker}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${isBuy ? "bg-[#00a572]/20 text-[#4edea3]" : "bg-[#ff5451]/20 text-[#ffb3ad]"}`}>
                        <FontAwesomeIcon icon={isBuy ? faArrowUp : faArrowDown} className="text-xs" />
                        {trade.tradeType}
                    </span>
                    <button
                        onClick={onEditClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 text-sm transition-all border border-white/8 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faPen} className="text-xs" />
                        Update Trade
                    </button>
                    <button
                        onClick={onDeleteClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff5451]/10 text-[#ff5451] hover:bg-[#ff5451]/20 text-sm transition-all border border-[#ff5451]/20 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Quantity", value: trade.quantity },
                    { label: "Price / Unit", value: `${trade.currency} ${trade.pricePerUnit.toLocaleString()}` },
                    { label: "Total Value", value: `${trade.currency} ${total.toLocaleString()}` },
                    {
                        label: "Trade Date", value: new Date(trade.tradeDate).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                        })
                    },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white/3 hover:bg-white/6 border border-transparent hover:border-white/10 rounded-xl p-4 transition-all">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">{label}</p>
                        <p className="text-white font-semibold">{value}</p>
                    </div>
                ))}
            </div>

            {trade.reason && (
                <div className="bg-white/3 hover:bg-white/6 border border-transparent hover:border-white/10 rounded-xl p-4 transition-all">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-mono">Trade Reason</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{trade.reason}</p>
                </div>
            )}
        </div>
    );
}
