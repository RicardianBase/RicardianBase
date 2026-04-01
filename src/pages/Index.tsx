import HeroSection from "@/components/HeroSection";
import ScrollRevealTagline from "@/components/ricardian/ScrollRevealTagline";
import TrustStatement from "@/components/ricardian/TrustStatement";
import ServicesGrid from "@/components/ricardian/ServicesGrid";
import OrbitalTestimonials from "@/components/ricardian/OrbitalTestimonials";
import PreventiveSection from "@/components/ricardian/PreventiveSection";
import ScienceSection from "@/components/ricardian/ScienceSection";
import RoadmapSection from "@/components/ricardian/RoadmapSection";
import FAQSection from "@/components/ricardian/FAQSection";
import CTASection from "@/components/ricardian/CTASection";
import RicardianFooter from "@/components/ricardian/RicardianFooter";

const Index = () => {
  return (
    <div className="relative" style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <HeroSection />
      <ScrollRevealTagline />
      <div id="about"><TrustStatement /></div>
      <div id="services"><ServicesGrid /></div>
      <div id="testimonials"><OrbitalTestimonials /></div>
      <PreventiveSection />
      <div id="how-it-works"><ScienceSection /></div>
      <div id="roadmap"><RoadmapSection /></div>
      <FAQSection />
      <div id="cta"><CTASection /></div>
      <RicardianFooter />
    </div>
  );
};

export default Index;
