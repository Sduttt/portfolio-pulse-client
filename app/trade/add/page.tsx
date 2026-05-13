"use client";
import TradeForm, { TradeFormData } from "../components/TradeForm";
import { tradeApi } from "@/lib/api/trade";

export default function AddTradePage() {
    const handleSubmit = async (data: TradeFormData) => {
        const res = await tradeApi.create(data);
        if(res.status === 200) {
            window.location.href = "/dashboard";
        }
    };

    return (
        <div className="min-h-[80vh] py-10 px-4 md:px-10 max-w-3xl mx-auto">
            <TradeForm
                mode="add"
                onSubmit={handleSubmit}
                onCancel={() => window.location.href = "/dashboard"}
            />
        </div>
    );
}
