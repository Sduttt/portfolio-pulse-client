type LoaderSize = "sm" | "md" | "lg";

const sizeMap: Record<LoaderSize, string> = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-10 border-[3px]",
};

const Loader = ({
    size = "md",
    color = "border-current",
    className = "",
}: {
    size?: LoaderSize;
    color?: string;
    className?: string;
}) => (
    <span
        className={`inline-block animate-spin rounded-full border-solid border-t-transparent ${sizeMap[size]} ${color} ${className}`}
        role="status"
        aria-label="Loading"
    />
);

export default Loader;
