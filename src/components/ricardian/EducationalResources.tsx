import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import edu1 from "@/assets/edu-1.jpg";
import edu2 from "@/assets/edu-2.jpg";
import edu3 from "@/assets/edu-3.jpg";

const resources = [
  { image: edu1, title: "Introduction to Smart Contracts", pill: "Beginner" },
  { image: edu2, title: "Escrow Fundamentals", pill: "Intermediate" },
  { image: edu3, title: "Dispute Resolution", pill: "Advanced" },
];

const EducationalResources = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row md:items-start md:justify-between mb-14 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 leading-snug max-w-xl">
            Our{" "}
            <span className="text-blue-400 font-instrument italic">Educational Webinars</span>{" "}
            is an invaluable resource for anyone looking to deepen their understanding of these subjects.
          </h2>
          <div className="mt-6 md:mt-0 flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-gray-500">Educational<br />Materials</span>
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-4 py-1.5 rounded-full">
              See All
            </span>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {resources.map((r, i) => (
            <div
              key={r.title}
              className={`bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${isInView ? "animate-fade-in-up" : ""}`}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="h-[160px] flex items-center justify-center bg-gray-50 rounded-xl">
                <img
                  src={r.image}
                  alt={r.title}
                  className="h-[120px] w-auto object-contain"
                  loading="lazy"
                  width={512}
                  height={512}
                />
              </div>
              <span className="inline-block mt-4 text-[10px] font-medium text-blue-500 bg-blue-50 rounded-full px-3 py-1">
                {r.pill}
              </span>
              <h3 className="mt-3 text-sm font-medium text-gray-900">{r.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationalResources;
