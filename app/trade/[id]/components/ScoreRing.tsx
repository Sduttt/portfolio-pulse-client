"use client";

type Props = {
    score: number;
};

export default function ScoreRing({ score }: Props) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? "#4edea3" : score >= 40 ? "#adc6ff" : "#ff5451";

    return (
        <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 136 136">
                <circle cx="68" cy="68" r={radius} fill="none" stroke="#32353c" strokeWidth="10" />
                <circle
                    cx="68"
                    cy="68"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="font-mono text-3xl font-bold text-white">{score}</span>
                <span className="text-xs text-gray-400">/ 100</span>
            </div>
        </div>
    );
}
