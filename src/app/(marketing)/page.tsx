import Hero from "@/app/components/Homepage/Hero";
import AnalysisMoment from "@/app/components/Homepage/AnalysisMoment";
import JournalsRail from "@/app/components/Homepage/JournalsRail";
import PublishMoment from "@/app/components/Homepage/PublishMoment";
import Cta from "@/app/components/Homepage/Cta";
import Footer from "@/app/components/Layout/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnalysisMoment />
      <JournalsRail />
      <PublishMoment />
      <Cta />
      <Footer />
    </>
  );
}
