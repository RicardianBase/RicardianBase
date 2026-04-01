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
            {/* Left: Stats */}
            <div className="p-8 md:p-12 flex flex-col justify-center md:w-2/5">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">From Data</span>
              <p className="text-sm text-gray-600 mt-1 font-medium">Average rate</p>
              <p className="text-[80px] md:text-[100px] font-light text-gray-900 leading-none mt-2 tracking-tight">
                92
                <span className="text-2xl text-gray-400 ml-1">%</span>
              </p>
              <div className="mt-4 h-1.5 bg-gray-200 rounded-full w-48 overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: "92%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                The score of client satisfaction in milestone-based contracts
              </p>
            </div>

            {/* Right: Image */}
            <div className="md:w-3/5 relative">
              <img
                src={statsHero}
                alt="Advanced technology"
                className="w-full h-full min-h-[300px] object-cover"
                loading="lazy"
                width={1024}
                height={640}
              />
              {/* Floating pills */}
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
                  Get The App
                </span>
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
                  View Documentation
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
