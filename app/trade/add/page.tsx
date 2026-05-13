"use client";
import TradeForm, { TradeFormData } from "../components/TradeForm";
import { tradeApi } from "@/lib/api/trade";

export default function AddTradePage() {
    const handleSubmit = async (data: TradeFormData) => {
        const res = await tradeApi.create(data);
        if (res.status === 200) {
            window.location.href = "/dashboard";
        }
    };

    return (
        <div className="mx-auto min-h-[80vh] max-w-3xl px-4 py-10 md:px-10">
            <TradeForm
                mode="add"
                onSubmit={handleSubmit}
                onCancel={() => (window.location.href = "/dashboard")}
            />
        </div>
    );
}
