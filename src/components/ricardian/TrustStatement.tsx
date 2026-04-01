import { ArrowRight } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const TrustStatement = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center relative">
        <div
          className={`inline-block mb-8 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <span className="border border-gray-200 text-gray-500 text-xs font-medium px-4 py-1.5 rounded-full">
            About RicardianBase
          </span>
        </div>

        <h2
          className={`text-3xl md:text-[40px] lg:text-[46px] leading-[1.2] font-medium text-gray-900 max-w-3xl mx-auto ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          Our platform is built for enterprise teams who demand speed, security, and certainty in tech sourcing.{" "}
          <span className="text-gray-400">
            We are committed to eliminating payment friction and contract risk.
          </span>
        </h2>

        <div
          className={`mt-10 flex items-center justify-center gap-6 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border border-gray-200 rounded-full px-5 py-2.5"
          >
            Explore Solutions <ArrowRight size={14} />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border border-gray-200 rounded-full px-5 py-2.5"
          >
            Meet Our Team <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrustStatement;
