import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const inputClass =
    "w-full bg-transparent text-gray-200 placeholder:text-gray-600 focus:outline-none text-sm md:text-base [color-scheme:dark]";

const InputField = ({
    label,
    faicon,
    children,
}: {
    label: string;
    faicon: any;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-2">
        <label className="font-jetbrains text-xs font-semibold tracking-widest text-gray-400 uppercase">
            {label}
        </label>
        <div className="flex items-center rounded-lg border border-gray-700/40 bg-[#10131A] px-4 py-2 focus-within:border-[#A2BAF0] focus-within:ring-1 focus-within:ring-[#A2BAF0]">
            <FontAwesomeIcon icon={faicon} className="mr-3 shrink-0 text-gray-500" />
            {children}
        </div>
    </div>
);

export default InputField;
