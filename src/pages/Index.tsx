import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VortexHero from "@/components/vortex/VortexHero";
import ImageMarquee from "@/components/vortex/ImageMarquee";
import TestimonialQuote from "@/components/vortex/TestimonialQuote";
import PricingSection from "@/components/vortex/PricingSection";
import TestimonialCarousel from "@/components/vortex/TestimonialCarousel";
import ProjectsSection from "@/components/vortex/ProjectsSection";
import PartnerCTA from "@/components/vortex/PartnerCTA";
import VortexFooter from "@/components/vortex/VortexFooter";
import FixedBottomNav from "@/components/vortex/FixedBottomNav";
import TrustStatement from "@/components/ricardian/TrustStatement";
import ServicesGrid from "@/components/ricardian/ServicesGrid";
import OrbitalTestimonials from "@/components/ricardian/OrbitalTestimonials";
import PreventiveSection from "@/components/ricardian/PreventiveSection";
import ScienceSection from "@/components/ricardian/ScienceSection";
import StatsShowcase from "@/components/ricardian/StatsShowcase";
import EducationalResources from "@/components/ricardian/EducationalResources";
import RicardianFooter from "@/components/ricardian/RicardianFooter";

const Index = () => {
  return (
    <div className="relative" style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <VortexHero />
      <ImageMarquee />
      <TestimonialQuote />
      <PricingSection />
      <TestimonialCarousel />
      <ProjectsSection />
      <PartnerCTA />
      <VortexFooter />

      {/* RicardianBase Sections */}
      <TrustStatement />
      <ServicesGrid />
      <OrbitalTestimonials />
      <PreventiveSection />
      <ScienceSection />
      <StatsShowcase />
      <EducationalResources />
      <RicardianFooter />

      <FixedBottomNav />
    </div>
  );
};

export default Index;
