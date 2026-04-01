import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import edu1 from "@/assets/smart-contracts-101.png";
import edu2 from "@/assets/escrow-fundamentals.png";
import edu3 from "@/assets/dispute-resolution.png";

const resources = [
  { image: edu1, title: "Smart Contracts 101", pill: "Introduction to" },
  { image: edu2, title: "Escrow Fundamentals", pill: "Contract Basics" },
  { image: edu3, title: "Dispute Resolution", pill: "Advanced Topics" },
];

const EducationalResources = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col md:flex-row md:items-start md:justify-between mb-14 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-3xl md:text-5xl font-medium text-gray-900 leading-snug max-w-3xl">
            We also offer educational resources to help you understand Ricardian contracts.{" "}
            <span className="text-gray-400">Our specialists will guide you through every step of implementation.</span>
          </h2>
          <div className="mt-6 md:mt-0 flex items-center gap-3 flex-shrink-0">
            <span className="border border-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
              Schedule Demo →
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {resources.map((r, i) => (
            <div
              key={r.title}
              className={`bg-gradient-to-b from-gray-50 to-gray-100/50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${isInView ? "animate-fade-in-up" : ""}`}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="h-[220px] flex items-center justify-center">
                <img src={r.image} alt={r.title} className="h-[180px] w-auto object-contain" loading="lazy" width={512} height={512} />
              </div>
              <span className="inline-block mt-4 text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1">
                {r.pill}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">{r.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationalResources;
