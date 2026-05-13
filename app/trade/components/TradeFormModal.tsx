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
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl">
                <button
                    onClick={onClose}
                    className="absolute -top-4 right-0 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-gray-400 transition-all hover:bg-white/20 hover:text-white"
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
