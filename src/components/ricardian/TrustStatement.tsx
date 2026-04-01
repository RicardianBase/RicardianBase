import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const TrustStatement = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-background py-32 md:py-44 px-6 min-h-[80vh] flex items-center">
      <div className="max-w-[1400px] mx-auto w-full relative">
        {/* Floating image top-right */}
        <div
          className={`hidden lg:block absolute -top-8 right-0 w-[220px] h-[160px] rounded-sm overflow-hidden ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Team collaboration"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Floating image left */}
        <div
          className={`hidden lg:block absolute top-1/2 -translate-y-1/2 left-0 w-[240px] h-[280px] rounded-sm overflow-hidden ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          <img
            src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Enterprise meeting"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Main quote — centered, bold, uppercase, editorial */}
        <div className="lg:pl-[300px] lg:pr-[100px]">
          <h2
            className={`text-[28px] md:text-[42px] lg:text-[52px] font-bold text-foreground leading-[1.15] tracking-tight uppercase ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            "RicardianBase is a trailblazer in enterprise contract execution, connecting companies with tech contractors through smart contracts that guarantee instant, automated payments."
          </h2>

          {/* Founder / attribution */}
          <div
            className={`mt-16 ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: "0.5s" }}
          >
            <div className="w-[100px] h-[120px] rounded-sm overflow-hidden mb-3">
              <img
                src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Founder"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm font-bold text-foreground uppercase tracking-wide">About RicardianBase</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Hybrid Ricardian Contract Platform</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStatement;
