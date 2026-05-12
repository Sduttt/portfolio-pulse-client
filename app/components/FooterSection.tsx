import Image from "next/image";

type Props = {};

const FooterSection = (props: Props) => {
    return (
        <div className="bg-[#0B0E15] px-6 py-8 lg:px-24">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                {/* Logo */}
                <div className="shrink-0">
                    <Image src="/Logo.png" alt="Logo" width={150} height={50} />
                </div>

                {/* Copyright */}
                <p className="text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} Portfolio Pulse. All rights reserved.
                </p>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    <a href="#" className="text-sm text-gray-400 transition hover:text-gray-200">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-sm text-gray-400 transition hover:text-gray-200">
                        Terms of Service
                    </a>
                    <a href="#" className="text-sm text-gray-400 transition hover:text-gray-200">
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FooterSection;
