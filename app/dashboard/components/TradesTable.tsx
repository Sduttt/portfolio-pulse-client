"use client";

import {
    faArrowDown,
    faArrowUp,
    faDownload,
    faFilter,
    faMagnifyingGlass,
    faPlus,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
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
        const headers = [
            "Asset Name",
            "Ticker",
            "Type",
            "Quantity",
            "Price/Unit",
            "Currency",
            "Trade Date",
        ];
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
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#1a1d27]/80 backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Active Positions &amp; Trades</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters((v) => !v)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${showFilters ? "bg-[#4d8eff] text-[#001a42]" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}
                    >
                        <FontAwesomeIcon icon={faFilter} className="text-xs" />
                        Filter
                    </button>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10"
                    >
                        <FontAwesomeIcon icon={faDownload} className="text-xs" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setAddModal(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#4d8eff] px-4 py-2 text-sm font-bold text-[#001a42] shadow-lg shadow-[#4d8eff]/20 transition-all hover:scale-105 active:scale-100"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        Add Trade
                    </button>
                </div>
            </div>

            {/* Filter bar */}
            {showFilters && (
                <div className="flex flex-wrap items-center gap-3 border-b border-white/8 bg-white/2 px-6 py-3">
                    {/* Search */}
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-500"
                        />
                        <input
                            type="text"
                            placeholder="Search asset or ticker..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-56 rounded-lg border border-white/10 bg-white/5 py-2 pr-3 pl-8 text-sm text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-[#4d8eff]/50 focus:outline-none"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
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
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${typeFilter === type ? "bg-[#4d8eff] text-[#001a42]" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
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
                        <tr className="bg-white/3 font-mono text-xs tracking-wider text-gray-500 uppercase">
                            <th className="px-6 py-3 font-medium">Asset</th>
                            <th className="px-6 py-3 font-medium">Ticker</th>
                            <th className="px-6 py-3 text-center font-medium">Type</th>
                            <th className="px-6 py-3 text-right font-medium">Qty</th>
                            <th className="px-6 py-3 text-right font-medium">Price / Unit</th>
                            <th className="px-6 py-3 text-right font-medium">Total</th>
                            <th className="px-6 py-3 text-right font-medium">Date</th>
                            <th className="px-6 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-6 py-12 text-center text-sm text-gray-500"
                                >
                                    No trades match your filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((trade) => {
                                const isBuy = trade.tradeType === "Buy";
                                const total = trade.quantity * trade.pricePerUnit;
                                return (
                                    <tr
                                        key={trade._id}
                                        className="transition-colors hover:bg-white/3"
                                    >
                                        <td className="px-6 py-4">
                                            <span
                                                className="block max-w-45 truncate text-sm font-medium text-gray-200"
                                                title={trade.assetName}
                                            >
                                                {trade.assetName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-md bg-[#4d8eff]/10 px-2 py-1 font-mono text-xs text-[#adc6ff]">
                                                {trade.ticker}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isBuy ? "bg-[#00a572]/20 text-[#4edea3]" : "bg-[#ff5451]/20 text-[#ffb3ad]"}`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={isBuy ? faArrowUp : faArrowDown}
                                                    className="text-[10px]"
                                                />
                                                {trade.tradeType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm text-gray-300">
                                            {trade.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm text-gray-300">
                                            {trade.currency} {trade.pricePerUnit.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm font-semibold text-white">
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
                                                className="cursor-pointer rounded-lg bg-[#4d8eff]/10 px-3 py-1.5 text-xs font-medium text-[#adc6ff] transition-all hover:bg-[#4d8eff]/20"
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
            <div className="border-t border-white/8 px-6 py-3 text-xs text-gray-600">
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
