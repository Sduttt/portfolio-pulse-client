"use client";
import Loader from "@/app/components/Loader";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    assetName?: string;
    deleting: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export default function DeleteModal({ assetName, deleting, onConfirm, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#1d2027] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#ff5451]/10 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faTrash} className="text-[#ff5451]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Delete Trade</h3>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                    Are you sure you want to delete{" "}
                    {assetName && <span className="text-white font-medium">{assetName}</span>}? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 text-sm transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#ff5451] text-white font-bold text-sm hover:bg-[#e04340] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {deleting ? <Loader size="sm" color="border-white" /> : <FontAwesomeIcon icon={faTrash} className="text-xs" />}
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
