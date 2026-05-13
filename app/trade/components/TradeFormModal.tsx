"use client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TradeForm, { TradeFormData } from "./TradeForm";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type Props = {
    mode: "add" | "edit";
    initialData?: Partial<TradeFormData>;
    onSubmit: (data: TradeFormData) => Promise<void>;
    onClose: () => void;
};

export default function TradeFormModal({ mode, initialData, onSubmit, onClose }: Props) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto">
            <div className="w-full max-w-3xl relative">
                <button
                    onClick={onClose}
                    className="absolute -top-4 right-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all cursor-pointer z-10"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <TradeForm
                    mode={mode}
                    initialData={initialData}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                />
            </div>
        </div>,
        document.body
    );
}
