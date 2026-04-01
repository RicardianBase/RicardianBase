import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import VortexButton from "./VortexButton";

const VortexHero = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-12 md:py-16 px-6 flex justify-center">
      <div className="max-w-[440px] text-center">
        {/* Logo */}
        <div
          className={`${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <h2
            className="text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-[#051A24]"
            style={{ fontFamily: "'PP Mondwest', serif" }}
          >
            V Vortex
          </h2>
          <p className="font-mono text-xs md:text-sm text-[#051A24] mt-1">
            The creative studio of Sarah Vortex
          </p>
        </div>

        {/* Heading */}
        <div
          className={`mt-8 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-[28px] md:text-[36px] leading-tight text-[#051A24]">
            Build the{" "}
            <span style={{ fontFamily: "'PP Mondwest', serif" }}>next wave</span>, the{" "}
            <span style={{ fontFamily: "'PP Mondwest', serif" }}>bold way.</span>
          </h2>
        </div>

        {/* Description */}
        <div
          className={`mt-6 space-y-4 text-sm md:text-base text-[#273C46] leading-relaxed ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          <p>
            After years leading design at Apple, Sarah Vortex founded Vortex Studio to bring
            world-class creative direction to ambitious startups and brands.
          </p>
          <p>
            We believe great design is invisible — it simply works. Our studio brings
            precision, clarity, and craft to every pixel.
          </p>
          <p className="font-medium text-[#051A24]">Starting at $25,000/month.</p>
        </div>

        {/* Buttons */}
        <div
          className={`mt-8 flex flex-col sm:flex-row gap-3 justify-center ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.4s" }}
        >
          <VortexButton variant="primary">Start a chat</VortexButton>
          <VortexButton variant="secondary">View projects</VortexButton>
        </div>
      </div>
    </section>
  );
};

export default VortexHero;
