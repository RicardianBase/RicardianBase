import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import statsHero from "@/assets/stats-hero.jpg";

const StatsShowcase = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-sm ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="p-8 md:p-12 flex flex-col justify-center md:w-2/5">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Platform Performance</span>
              <p className="text-sm text-gray-600 mt-1 font-medium">Average payment speed</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-[80px] md:text-[100px] font-light text-gray-900 leading-none tracking-tight">14</p>
                <span className="text-xl text-gray-400">seconds</span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>RicardianBase</span>
                  <span>Industry: 45 days</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full w-48 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "98%" }} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Instant stablecoin settlement vs. traditional 30–90 day payment cycles
              </p>
            </div>

            <div className="md:w-3/5 relative">
              <img src={statsHero} alt="Platform technology" className="w-full h-full min-h-[300px] object-cover" loading="lazy" width={1024} height={640} />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
                  View API Docs
                </span>
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
                  Technical Whitepaper
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsShowcase;
