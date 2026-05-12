import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
type Props = {};

const Hero = (props: Props) => {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#10131a]">
            {/* Blue glow — top right */}
            <div className="pointer-events-none absolute top-[-10%] right-[-5%] h-150 w-150 rounded-full bg-[#adc6ff]/10 blur-[120px]" />
            {/* Green glow — bottom left */}
            <div className="pointer-events-none absolute bottom-[-10%] left-[-5%] h-100 w-100 rounded-full bg-[#4edea3]/10 blur-[100px]" />

            <div className="mx-4 w-full lg:w-1/2 lg:pr-8">
                <div className="ml-1 flex w-fit items-center justify-center rounded-4xl border border-[#10B981] bg-[#10B98119] px-4 py-2 lg:px-6">
                    <FontAwesomeIcon
                        icon={faBoltLightning}
                        className="mx-2 size-4 self-center text-[#10B981]"
                    />
                    <p className="font-jetbrains text-xs font-semibold text-[#10B981] uppercase">
                        AI-Powered Portfolio Analysis
                    </p>
                </div>

                <h1 className="font-inter mt-4 text-3xl font-bold text-white md:text-5xl lg:mt-6 lg:text-7xl">
                    Unlock Your Portfolio's Potential with{" "}
                    <span className="font-hanken text-[#A2BAF0]">AI Insights</span>
                </h1>

                <p className="font-inter mt-2 text-base text-gray-400 md:text-xl lg:mt-6 lg:pr-20 lg:text-2xl">
                    Navigate the markets with the same precision and data-driven insights used by
                    top-tier hedge funds. Real-time analysis, automated tracking, and predictive
                    sentiment.
                </p>

                <div className="mt-2 md:flex">
                    <Link href="/auth" className="font-hanken mt-4 mr-4 flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#A2BAF0] px-5 py-2 text-base font-bold text-[#10131A] transition hover:bg-[#A2BAF0]/90 md:w-fit lg:px-8 lg:py-4 lg:text-xl">
                        Get Started{" "}
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2 size-4 md:hidden" />
                    </Link>
                    <button className="font-hanken mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-400 px-5 py-2 text-base font-bold text-gray-400 transition hover:border-gray-300 hover:text-gray-300 md:w-fit lg:px-8 lg:py-4 lg:text-xl">
                        See Pricing{" "}
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2 size-4 md:hidden" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
