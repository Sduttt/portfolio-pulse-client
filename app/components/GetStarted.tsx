import { faArrowRight, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type Props = {};

const GetStarted = (props: Props) => {
    return (
        <div className="bg-[#10131A] px-4 py-14 md:py-18 lg:px-24">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
                {/* Image */}
                <div className="relative order-1 w-full flex-1 lg:order-1">
                    <div className="absolute -inset-4 rounded-full bg-[#A2BAF0]/10 blur-3xl" />
                    <Image
                        src="https://images.pexels.com/photos/35638668/pexels-photo-35638668.jpeg"
                        alt="Visualize The Unseen"
                        width={600}
                        height={400}
                        className="relative z-10 h-72 w-full rounded-2xl border border-gray-700/30 object-cover shadow-2xl md:h-96"
                    />
                </div>

                {/* Content */}
                <div className="order-2 w-full flex-1 space-y-6 lg:order-2">
                    <h2 className="font-hanken text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        Visualize The Unseen.
                    </h2>
                    <p className="text-base text-gray-400 md:text-lg lg:text-xl">
                        Standard charts only tell half the story. Portfolio Pulse connects the dots
                        between historical data, current volume, and future intent.
                    </p>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="mt-1 size-5 shrink-0 text-[#10B981]"
                            />
                            <div>
                                <p className="font-semibold text-gray-200">Smart Money Tracking</p>
                                <p className="text-sm text-gray-400 md:text-base">
                                    See where the whales are positioning before the movement
                                    happens.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="mt-1 size-5 shrink-0 text-[#10B981]"
                            />
                            <div>
                                <p className="font-semibold text-gray-200">
                                    Dynamic Correlation Maps
                                </p>
                                <p className="text-sm text-gray-400 md:text-base">
                                    Understand how your assets move together during high volatility
                                    events.
                                </p>
                            </div>
                        </li>
                    </ul>

                    <button className="font-hanken mt-2 flex cursor-pointer items-center gap-2 rounded-lg bg-[#10B981] px-6 py-3 text-base font-bold text-[#00311f] transition hover:bg-[#10B981]/90">
                        Explore Analysis Tools
                        <FontAwesomeIcon icon={faArrowRight} className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
