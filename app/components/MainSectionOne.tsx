import { faBrain, faBullhorn, faChartBar, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type Props = {};

const MainSectionOne = (props: Props) => {
    return (
        <div className="bg-[#0B0E15] px-4 py-14 md:py-18 lg:px-24">
            <div className="mx-auto md:w-2/3">
                <h1 className="font-hanken mt-10 text-center text-3xl font-bold text-white md:text-4xl lg:mt-6 lg:text-6xl">
                    Real time analysis of your trades
                </h1>
                <p className="mx-auto mt-4 text-center text-base text-gray-400 md:w-2/3 md:text-lg lg:text-xl">
                    Get insights into your trading patterns and make informed decisions with our
                    AI-powered tools. Identify strengths, weaknesses, and areas for improvement in
                    your trading strategy.
                </p>
            </div>

            <div className="mt-18 mb-4 flex flex-col md:flex-row">
                {/* CARD 1 */}
                <div className="mb-4 w-full rounded-xl bg-[#1A2333] p-8 md:mr-2 md:mb-0 md:w-3/5">
                    <FontAwesomeIcon icon={faBrain} className="mb-4 size-8 text-[#A2BAF0]" />

                    <h1 className="my-4 text-xl font-semibold text-gray-200 md:my-6 md:text-2xl lg:text-3xl">
                        Latest AI Models
                    </h1>

                    <p className="w-full text-sm text-gray-400 md:w-2/3 md:text-base lg:text-lg">
                        Stay ahead with the most advanced AI models, continuously updated to provide
                        you with the best insights and predictions for your trading strategies.
                    </p>

                    <Image
                        src="https://images.pexels.com/photos/5380603/pexels-photo-5380603.jpeg"
                        alt="AI Models"
                        width={600}
                        height={400}
                        className="mt-6 hidden h-96 w-full rounded-lg object-cover md:block"
                    />
                </div>

                {/* CARD 2 */}
                <div className="w-full rounded-xl bg-[#1A2333] p-8 md:ml-2 md:w-2/5">
                    <FontAwesomeIcon icon={faChartBar} className="mb-4 size-8 text-[#10B981]" />

                    <h1 className="my-4 text-xl font-semibold text-gray-200 md:my-6 md:text-2xl lg:text-3xl">
                        Trade Tracking
                    </h1>
                    <p className="text-sm text-gray-400 md:text-base lg:text-lg">
                        Monitor your trades in real-time with our intuitive tracking system,
                        providing you with detailed analytics and insights to optimize your trading
                        performance.
                    </p>

                    <Image
                        src="https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg"
                        alt="Trade Tracking"
                        width={600}
                        height={400}
                        className="mt-6 hidden h-96 w-full rounded-lg object-cover md:block"
                    />
                </div>
            </div>
            <div className="mt-4 mb-6 flex flex-col md:flex-row">
                <div className="mb-4 w-full rounded-xl bg-[#1A2333] p-8 md:mr-4 md:mb-0 md:w-2/7">
                    <FontAwesomeIcon icon={faLock} className="mb-4 size-8 text-gray-500" />

                    <h1 className="my-4 text-xl font-semibold text-gray-200 md:my-6 md:text-2xl lg:text-3xl">
                        Data Privacy
                    </h1>
                    <p className="text-sm text-gray-400 md:text-base lg:text-lg">
                        Your data is secure with us. We prioritize your privacy and employ robust
                        security measures to ensure that your trading information remains
                        confidential and protected at all times.
                    </p>
                </div>
                <div className="flex w-full rounded-xl bg-[#1A2333] p-8 md:ml-4 md:w-5/7">
                    <div className="w-full md:w-4/7">
                        <FontAwesomeIcon icon={faBullhorn} className="mb-4 size-8 text-[#FFB3AD]" />
                        <h1 className="my-4 text-xl font-semibold text-gray-200 md:my-6 md:text-2xl lg:text-3xl">
                            Unlock Your Trading Potential
                        </h1>
                        <p className="text-sm text-gray-400 md:text-base lg:text-lg">
                            Experience the power of AI-driven insights and take your trading to the
                            next level. Our platform provides you with the tools and analytics you
                            need to make informed decisions and maximize your trading success.
                        </p>
                    </div>
                    <Image
                        src="https://images.pexels.com/photos/26762397/pexels-photo-26762397.jpeg"
                        alt="Unlock Potential"
                        width={600}
                        height={400}
                        className="ml-8 hidden h-84 rounded-lg object-cover md:block"
                    />
                </div>
            </div>
        </div>
    );
};

export default MainSectionOne;
