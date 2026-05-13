"use client";

import { faArrowDown, faArrowUp, faDownload, faFilter, faMagnifyingGlass, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TradeFormModal from "@/app/trade/components/TradeFormModal";
import { tradeApi } from "@/lib/api/trade";
import { TradeFormData } from "@/app/trade/components/TradeForm";

type Trade = {
    _id: string;
    assetName: string;
    ticker: string;
    tradeType: "Buy" | "Sell";
    quantity: number;
    pricePerUnit: number;
    currency: string;
    tradeDate: string;
};

type Props = {
    trades: Trade[];
    onTradeAdded?: () => void;
};

const TRADE_TYPES = ["All", "Buy", "Sell"];

export default function TradesTable({ trades, onTradeAdded }: Props) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const handleAddTrade = async (data: TradeFormData) => {
        await tradeApi.create(data);
        setAddModal(false);
        onTradeAdded?.();
    };

    const filtered = trades.filter((t) => {
        const matchesSearch =
            t.assetName.toLowerCase().includes(search.toLowerCase()) ||
            t.ticker.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "All" || t.tradeType === typeFilter;
        return matchesSearch && matchesType;
    });

    const exportCSV = () => {
        const headers = ["Asset Name", "Ticker", "Type", "Quantity", "Price/Unit", "Currency", "Trade Date"];
        const rows = filtered.map((t) => [
            `"${t.assetName}"`,
            t.ticker,
            t.tradeType,
            t.quantity,
            t.pricePerUnit,
            t.currency,
            new Date(t.tradeDate).toLocaleDateString(),
        ]);
        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "trades.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-[#1a1d27]/80 backdrop-blur-md border border-white/8 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/8">
                <h3 className="text-lg font-semibold text-white">
                    Active Positions &amp; Trades
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters((v) => !v)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showFilters ? "bg-[#4d8eff] text-[#001a42]" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                    >
                        <FontAwesomeIcon icon={faFilter} className="text-xs" />
                        Filter
                    </button>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 text-sm font-medium transition-all"
                    >
                        <FontAwesomeIcon icon={faDownload} className="text-xs" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4d8eff] text-[#001a42] font-bold text-sm shadow-lg shadow-[#4d8eff]/20 hover:scale-105 active:scale-100 transition-all cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        Add Trade
                    </button>
                </div>
            </div>

            {/* Filter bar */}
            {showFilters && (
                <div className="px-6 py-3 flex flex-wrap items-center gap-3 border-b border-white/8 bg-white/2">
                    {/* Search */}
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"
                        />
                        <input
                            type="text"
                            placeholder="Search asset or ticker..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#4d8eff]/50 w-56"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                <FontAwesomeIcon icon={faXmark} className="text-xs" />
                            </button>
                        )}
                    </div>

                    {/* Trade type */}
                    <div className="flex gap-1">
                        {TRADE_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => setTypeFilter(type)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${typeFilter === type ? "bg-[#4d8eff] text-[#001a42]" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/3 text-gray-500 text-xs uppercase tracking-wider font-mono">
                            <th className="px-6 py-3 font-medium">Asset</th>
                            <th className="px-6 py-3 font-medium">Ticker</th>
                            <th className="px-6 py-3 font-medium text-center">Type</th>
                            <th className="px-6 py-3 font-medium text-right">Qty</th>
                            <th className="px-6 py-3 font-medium text-right">Price / Unit</th>
                            <th className="px-6 py-3 font-medium text-right">Total</th>
                            <th className="px-6 py-3 font-medium text-right">Date</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                                    No trades match your filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((trade) => {
                                const isBuy = trade.tradeType === "Buy";
                                const total = trade.quantity * trade.pricePerUnit;
                                return (
                                    <tr key={trade._id} className="hover:bg-white/3 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-200 font-medium max-w-45 block truncate" title={trade.assetName}>
                                                {trade.assetName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono text-[#adc6ff] bg-[#4d8eff]/10 px-2 py-1 rounded-md">
                                                {trade.ticker}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isBuy ? "bg-[#00a572]/20 text-[#4edea3]" : "bg-[#ff5451]/20 text-[#ffb3ad]"}`}>
                                                <FontAwesomeIcon icon={isBuy ? faArrowUp : faArrowDown} className="text-[10px]" />
                                                {trade.tradeType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-300 font-mono">
                                            {trade.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-300 font-mono">
                                            {trade.currency} {trade.pricePerUnit.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-white font-semibold font-mono">
                                            {trade.currency} {total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs text-gray-500">
                                            {new Date(trade.tradeDate).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => router.push(`/trade/${trade._id}`)}
                                                className="px-3 py-1.5 rounded-lg bg-[#4d8eff]/10 text-[#adc6ff] hover:bg-[#4d8eff]/20 text-xs font-medium transition-all cursor-pointer"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer count */}
            <div className="px-6 py-3 border-t border-white/8 text-xs text-gray-600">
                Showing {filtered.length} of {trades.length} trades
            </div>

            {/* Add Trade Modal */}
            {addModal && (
                <TradeFormModal
                    mode="add"
                    onSubmit={handleAddTrade}
                    onClose={() => setAddModal(false)}
                />
            )}
        </div>
    );
}
