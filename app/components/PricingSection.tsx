import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {};

const PricingSection = (props: Props) => {
    return (
        <div className="bg-[#A2BAF0] px-4 py-16 md:py-24 lg:px-24">
            <div className="mx-auto max-w-7xl text-center">
                {/* Header */}
                <p className="font-jetbrains mb-3 text-xs font-semibold tracking-widest text-[#002E6A] uppercase">
                    Simple Pricing
                </p>
                <h2 className="font-hanken text-3xl font-bold text-[#001A42] md:text-4xl lg:text-5xl">
                    One plan. Everything included.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-[#002E6A]/80 md:text-lg">
                    No tiers, no hidden fees. Get full access to all features for a single
                    affordable price.
                </p>

                {/* Pricing Card */}
                <div className="mx-auto mt-12 max-w-md rounded-2xl bg-[#001A42] px-8 py-10 shadow-2xl">
                    <p className="font-hanken text-sm font-semibold tracking-widest text-[#A2BAF0] uppercase">
                        Pro Plan
                    </p>

                    <div className="mt-4 flex items-end justify-center gap-1">
                        <span className="font-hanken text-6xl font-bold text-white">₹49</span>
                        <span className="mb-2 text-lg text-gray-400">/ month</span>
                    </div>

                    <p className="mt-2 text-sm text-gray-400">Billed monthly. Cancel anytime.</p>

                    {/* Features */}
                    <ul className="mt-8 space-y-4 text-left">
                        {[
                            "Real-time trade tracking & analytics",
                            "AI-powered portfolio insights",
                            "Smart money & whale tracking",
                            "Dynamic correlation maps",
                            "Data privacy & end-to-end encryption",
                            "Unlimited trade history",
                        ].map((feature) => (
                            <li key={feature} className="flex items-center gap-3">
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20">
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className="size-3 text-[#10B981]"
                                    />
                                </span>
                                <span className="text-sm text-gray-300 md:text-base">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <button className="font-hanken mt-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#A2BAF0] px-6 py-4 text-base font-bold text-[#001A42] transition hover:bg-[#A2BAF0]/90">
                        Get Started Free
                        <FontAwesomeIcon icon={faArrowRight} className="size-4" />
                    </button>
                    <p className="mt-3 text-xs text-gray-500">Cancel anytime.</p>
                </div>
            </div>
        </div>
    );
};

export default PricingSection;
