import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const TestimonialQuote = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <blockquote
          className={`text-2xl md:text-3xl leading-relaxed text-[#051A24] ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          "Working with someone who shaped design at{" "}
          <span style={{ fontFamily: "'PP Mondwest', serif" }}>Apple</span> means you get
          a level of craft and intentionality that's simply unmatched."
        </blockquote>

        <p
          className={`mt-6 text-sm italic text-[#273C46] ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          — Sarah Vortex
        </p>

        <div
          className={`mt-10 flex items-center justify-center gap-8 text-xs font-medium tracking-wider uppercase text-[#273C46] ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          <span>Stripe</span>
          <span>Linear</span>
          <span>Notion</span>
        </div>
      </div>
    </section>
  );
};

export default TestimonialQuote;
