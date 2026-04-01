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
      <FixedBottomNav />
    </div>
  );
};

export default Index;
