import GetStarted from "./components/GetStarted";
import Hero from "./components/Hero";
import MainSectionOne from "./components/MainSectionOne";
import PricingSection from "./components/PricingSection";

export default function Home() {
    return (
        <>
            <Hero />
            <MainSectionOne />
            <GetStarted />
            <PricingSection />
        </>
    );
}
