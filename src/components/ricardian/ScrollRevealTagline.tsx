import { useRef, useEffect, useState } from "react";

const words = [
  { text: "We believe the future of enterprise contracting is", highlight: false },
  { text: "trustless,", highlight: true },
  { text: "instant,", highlight: true },
  { text: "and", highlight: false },
  { text: "legally compliant.", highlight: true },
];

const secondLine = "Ricardian combines the legal enforceability of traditional contracts with the programmatic certainty of smart contracts — creating a hybrid instrument called a Ricardian contract.";

const ScrollRevealTagline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Progress from 0 (section top enters viewport) to 1 (section bottom leaves)
      const start = rect.top - viewportHeight;
      const end = rect.bottom;
      const total = end - start;
      const current = -start;
      const progress = Math.max(0, Math.min(1, current / total));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Split the first sentence into individual words for per-word reveal
  const allWords: { text: string; highlight: boolean }[] = [];
  words.forEach((segment) => {
    const segmentWords = segment.text.split(" ");
    segmentWords.forEach((w) => {
      allWords.push({ text: w, highlight: segment.highlight });
    });
  });

  const totalWords = allWords.length;

  return (
    <section
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
      style={{ minHeight: "auto" }}
    >
      {/* Subtle gradient accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(140,40%,55%,0.04) 0%, transparent 70%)",
          opacity: Math.min(scrollProgress * 3, 1),
        }}
      />

      <div className="relative flex items-center justify-center px-6 py-12 md:px-12 md:py-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main headline — word-by-word reveal */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.2] tracking-tight mb-8"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {allWords.map((word, i) => {
              // Each word appears as scroll progresses through 0.15–0.55 range
              const wordStart = 0.1 + (i / totalWords) * 0.4;
              const wordEnd = wordStart + 0.08;
              const wordOpacity = Math.max(0, Math.min(1, (scrollProgress - wordStart) / (wordEnd - wordStart)));
              const wordY = (1 - wordOpacity) * 18;

              return (
                <span
                  key={i}
                  className="inline-block mr-[0.3em] transition-none"
                  style={{
                    opacity: wordOpacity,
                    transform: `translateY(${wordY}px)`,
                    color: word.highlight
                      ? `hsl(140, ${35 + wordOpacity * 10}%, ${38 + wordOpacity * 5}%)`
                      : undefined,
                    fontStyle: word.highlight ? "italic" : undefined,
                  }}
                >
                  {word.text}
                </span>
              );
            })}
          </h2>

          {/* Second paragraph — fades in as a block */}
          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            style={{
              opacity: Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.15)),
              transform: `translateY(${Math.max(0, (1 - Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.15))) * 20)}px)`,
            }}
          >
            {secondLine}
          </p>

          {/* Decorative line */}
          <div className="mt-10 flex justify-center">
            <div
              className="h-px bg-gradient-to-r from-transparent via-[hsl(140,35%,55%)] to-transparent transition-none"
              style={{
                width: `${Math.max(0, Math.min(100, (scrollProgress - 0.6) / 0.15 * 100))}%`,
                maxWidth: "200px",
                opacity: Math.max(0, Math.min(0.4, (scrollProgress - 0.6) / 0.15)),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollRevealTagline;
