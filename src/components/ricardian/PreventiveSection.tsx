import { ArrowRight } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import edu1 from "@/assets/edu-1.jpg";
import edu2 from "@/assets/edu-2.jpg";
import edu3 from "@/assets/edu-3.jpg";

const resources = [
  { image: edu1, pill: "Introduction to", title: "Smart Contracts 101" },
  { image: edu2, pill: "Contract Basics", title: "Escrow Fundamentals" },
  { image: edu3, pill: "Advanced Topics", title: "Dispute Resolution" },
];

const PreventiveSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-medium text-gray-900 leading-[1.25] max-w-2xl">
            We also offer educational resources to help you understand smart contracts.{" "}
            <span className="text-gray-400">Our specialists will guide you through every step.</span>
          </h2>
          <a
            href="#"
            className="mt-6 md:mt-0 inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-full px-5 py-2.5 hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            Make an Appointment <ArrowRight size={14} />
          </a>
        </div>

        {/* Resource cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {resources.map((r, i) => (
            <div
              key={r.title}
              className={`bg-gray-50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${isInView ? "animate-fade-in-up" : ""}`}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="h-[180px] flex items-center justify-center">
                <img
                  src={r.image}
                  alt={r.title}
                  className="h-full w-auto object-contain"
                  loading="lazy"
                  width={512}
                  height={512}
                />
              </div>
              <span className="inline-block mt-4 text-[10px] font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1">
                {r.pill}
              </span>
              <h3 className="mt-3 text-base font-medium text-gray-900">{r.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreventiveSection;
