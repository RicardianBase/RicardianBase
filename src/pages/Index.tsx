import HeroSection from "@/components/HeroSection";
import TrustStatement from "@/components/ricardian/TrustStatement";
import ServicesGrid from "@/components/ricardian/ServicesGrid";
import OrbitalTestimonials from "@/components/ricardian/OrbitalTestimonials";
import PreventiveSection from "@/components/ricardian/PreventiveSection";
import ScienceSection from "@/components/ricardian/ScienceSection";
import RicardianFooter from "@/components/ricardian/RicardianFooter";

const Index = () => {
  return (
    <div className="relative" style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <HeroSection />
      <TrustStatement />
      <ServicesGrid />
      <OrbitalTestimonials />
      <PreventiveSection />
      <ScienceSection />
      <RicardianFooter />
    </div>
  );
};

export default Index;
