import { ArrowRight } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import edu1 from "@/assets/smart-contracts-101.png";
import edu2 from "@/assets/escrow-fundamentals.png";
import edu3 from "@/assets/dispute-resolution.png";

const resources = [
  { image: edu1, pill: "Introduction to", title: "Smart Contracts 101" },
  { image: edu2, pill: "Contract Basics", title: "Escrow Fundamentals" },
  { image: edu3, pill: "Advanced Topics", title: "Dispute Resolution" },
];

const PreventiveSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-background py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-medium text-foreground leading-[1.25] max-w-2xl">
            We also offer educational resources to help you understand Ricardian contracts.{" "}
            <span className="text-muted-foreground">Our specialists will guide you through every step of implementation.</span>
          </h2>
          <a
            href="#"
            className="mt-6 md:mt-0 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-full px-5 py-2.5 hover:bg-secondary transition-colors whitespace-nowrap flex-shrink-0"
          >
            Schedule Demo <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {resources.map((r, i) => (
            <div
              key={r.title}
              className={`bg-secondary/40 border border-border rounded-[2rem] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${isInView ? "animate-fade-in-up" : ""}`}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="h-[220px] flex items-center justify-center">
                <img src={r.image} alt={r.title} className="h-[180px] w-[180px] object-contain" loading="lazy" width={512} height={512} />
              </div>
              <span className="inline-block mt-4 text-[10px] font-medium text-muted-foreground border border-border rounded-full px-3 py-1">
                {r.pill}
              </span>
              <h3 className="mt-3 text-base font-medium text-foreground">{r.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreventiveSection;
