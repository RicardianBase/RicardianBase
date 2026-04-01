import { useState, useCallback } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import VortexButton from "./VortexButton";

const previewImages = [
  "https://motionsites.ai/cdn-cgi/image/width=200,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/2.gif",
  "https://motionsites.ai/cdn-cgi/image/width=200,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/4.gif",
  "https://motionsites.ai/cdn-cgi/image/width=200,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/6.gif",
  "https://motionsites.ai/cdn-cgi/image/width=200,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/8.gif",
];

interface TrailImage {
  id: number;
  x: number;
  y: number;
  src: string;
}

let nextId = 0;

const PartnerCTA = () => {
  const { ref, isInView } = useInViewAnimation();
  const [trail, setTrail] = useState<TrailImage[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const src = previewImages[nextId % previewImages.length];
    const id = nextId++;

    setTrail((prev) => [...prev.slice(-6), { id, x, y, src }]);

    setTimeout(() => {
      setTrail((prev) => prev.filter((img) => img.id !== id));
    }, 1200);
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-[#051A24] py-24 md:py-32 px-6 overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
    >
      {trail.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          className="absolute w-24 h-32 object-cover rounded-xl pointer-events-none opacity-60"
          style={{
            left: img.x - 48,
            top: img.y - 64,
            animation: "fadeInUp 0.4s ease-out forwards",
          }}
        />
      ))}

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2
          className={`text-4xl md:text-6xl text-white leading-tight ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          Ready to build the{" "}
          <span style={{ fontFamily: "'PP Mondwest', serif" }}>next wave</span>?
        </h2>
        <p
          className={`mt-6 text-[#E0EBF0] text-base md:text-lg ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          Limited spots available. Let's talk about your project.
        </p>
        <div
          className={`mt-10 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          <VortexButton variant="secondary">Start a chat</VortexButton>
        </div>
      </div>
    </section>
  );
};

export default PartnerCTA;
