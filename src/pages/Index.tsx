import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import ProblemSolution from "@/components/ProblemSolution";
import RicardianMagic from "@/components/RicardianMagic";
import HowItWorks from "@/components/HowItWorks";
import ForWhom from "@/components/ForWhom";
import TechStack from "@/components/TechStack";
import FeaturesGrid from "@/components/FeaturesGrid";
import Pricing from "@/components/Pricing";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="relative">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <ProblemSolution />
      <RicardianMagic />
      <HowItWorks />
      <ForWhom />
      <TechStack />
      <FeaturesGrid />
      <Pricing />
      <SiteFooter />
    </div>
  );
};

export default Index;
