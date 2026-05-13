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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1d2027] p-6 shadow-2xl">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff5451]/10">
                        <FontAwesomeIcon icon={faTrash} className="text-[#ff5451]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Delete Trade</h3>
                </div>
                <p className="mb-6 text-sm text-gray-400">
                    Are you sure you want to delete{" "}
                    {assetName && <span className="font-medium text-white">{assetName}</span>}? This
                    action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 cursor-pointer rounded-xl bg-white/5 py-2.5 text-sm text-gray-400 transition-all hover:bg-white/10"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff5451] py-2.5 text-sm font-bold text-white transition-all hover:bg-[#e04340] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleting ? (
                            <Loader size="sm" color="border-white" />
                        ) : (
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        )}
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
