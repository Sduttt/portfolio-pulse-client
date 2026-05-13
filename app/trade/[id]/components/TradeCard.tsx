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
        <div className="mb-6 rounded-2xl border border-white/8 bg-[#1a1d27]/80 p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="mb-1 text-2xl font-bold text-white">{trade.assetName}</h1>
                    <span className="rounded-md bg-[#4d8eff]/10 px-2 py-1 font-mono text-xs text-[#adc6ff]">
                        {trade.ticker}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${isBuy ? "bg-[#00a572]/20 text-[#4edea3]" : "bg-[#ff5451]/20 text-[#ffb3ad]"}`}
                    >
                        <FontAwesomeIcon
                            icon={isBuy ? faArrowUp : faArrowDown}
                            className="text-xs"
                        />
                        {trade.tradeType}
                    </span>
                    <button
                        onClick={onEditClick}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/10"
                    >
                        <FontAwesomeIcon icon={faPen} className="text-xs" />
                        Update Trade
                    </button>
                    <button
                        onClick={onDeleteClick}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#ff5451]/20 bg-[#ff5451]/10 px-4 py-2 text-sm text-[#ff5451] transition-all hover:bg-[#ff5451]/20"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                    { label: "Quantity", value: trade.quantity },
                    {
                        label: "Price / Unit",
                        value: `${trade.currency} ${trade.pricePerUnit.toLocaleString()}`,
                    },
                    { label: "Total Value", value: `${trade.currency} ${total.toLocaleString()}` },
                    {
                        label: "Trade Date",
                        value: new Date(trade.tradeDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }),
                    },
                ].map(({ label, value }) => (
                    <div
                        key={label}
                        className="rounded-xl border border-transparent bg-white/3 p-4 transition-all hover:border-white/10 hover:bg-white/6"
                    >
                        <p className="mb-1 font-mono text-xs tracking-wider text-gray-500 uppercase">
                            {label}
                        </p>
                        <p className="font-semibold text-white">{value}</p>
                    </div>
                ))}
            </div>

            {trade.reason && (
                <div className="rounded-xl border border-transparent bg-white/3 p-4 transition-all hover:border-white/10 hover:bg-white/6">
                    <p className="mb-2 font-mono text-xs tracking-wider text-gray-500 uppercase">
                        Trade Reason
                    </p>
                    <p className="text-sm leading-relaxed text-gray-300">{trade.reason}</p>
                </div>
            )}
        </div>
    );
}
