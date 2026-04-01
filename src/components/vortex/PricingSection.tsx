import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import VortexButton from "./VortexButton";
import { Check } from "lucide-react";

const features = [
  "Dedicated design partner",
  "Unlimited requests & revisions",
  "Avg. 48-hour turnaround",
  "Pause or cancel anytime",
];

const PricingSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl text-[#051A24] mb-12 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          Simple, transparent pricing
        </h2>

        <div className="flex flex-col md:flex-row gap-6 md:justify-end">
          {/* Dark card */}
          <div
            className={`bg-[#051A24] text-white rounded-3xl p-8 md:p-10 max-w-md w-full ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-sm font-medium text-[#E0EBF0] uppercase tracking-wider">Monthly Partnership</p>
            <p className="text-4xl md:text-5xl font-medium mt-4">$25,000<span className="text-lg text-[#E0EBF0]">/mo</span></p>
            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#E0EBF0]">
                  <Check size={16} className="text-[#E0EBF0] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <VortexButton variant="secondary" className="mt-8 w-full">Get started</VortexButton>
          </div>

          {/* Light card */}
          <div
            className={`bg-[#F6FCFF] border border-[#E0EBF0] rounded-3xl p-8 md:p-10 max-w-md w-full ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-sm font-medium text-[#273C46] uppercase tracking-wider">Custom Project</p>
            <p className="text-4xl md:text-5xl font-medium mt-4 text-[#051A24]">$25,000<span className="text-lg text-[#273C46]">+</span></p>
            <p className="mt-4 text-sm text-[#273C46] leading-relaxed">
              For larger scopes, brand identities, or full product design engagements. Scoped and quoted per project.
            </p>
            <VortexButton variant="primary" className="mt-8 w-full">Start a chat</VortexButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
