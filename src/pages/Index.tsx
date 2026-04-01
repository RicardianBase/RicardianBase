import HeroSection from "@/components/HeroSection";
import ScrollRevealTagline from "@/components/ricardian/ScrollRevealTagline";
import TrustStatement from "@/components/ricardian/TrustStatement";
import ServicesGrid from "@/components/ricardian/ServicesGrid";
import OrbitalTestimonials from "@/components/ricardian/OrbitalTestimonials";
import PreventiveSection from "@/components/ricardian/PreventiveSection";
import ScienceSection from "@/components/ricardian/ScienceSection";
import RoadmapSection from "@/components/ricardian/RoadmapSection";
import RicardianFooter from "@/components/ricardian/RicardianFooter";

const Index = () => {
  return (
    <div className="relative" style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <HeroSection />
      <ScrollRevealTagline />
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
