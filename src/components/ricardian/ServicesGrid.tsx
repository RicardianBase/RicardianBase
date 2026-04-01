import { ArrowRight, ArrowUpRight, GripHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import service1 from "@/assets/service-1.jpg";
import service2 from "@/assets/service-2.jpg";
import service3 from "@/assets/service-3.jpg";

const services = [
  {
    image: service1,
    pills: ["Smart Escrow"],
    title: "Diagnosis of contract risks",
    price: "$320",
    priceSuffix: ".00",
    desc: "modern equipment for accurate diagnosis",
  },
  {
    image: service2,
    pills: ["Milestone Tracking"],
    title: "Treatment of payment delays",
    price: "≈$2.5k",
    priceSuffix: "",
    desc: "individual treatment plans",
  },
  {
    image: service3,
    pills: ["Auto-Payments"],
    title: "Rehabilitation of trust",
    price: "$320",
    priceSuffix: ".00",
    desc: "modern equipment for accurate diagnosis",
  },
  {
    image: service1,
    pills: ["Smart Escrow"],
    title: "Diagnosis of contract risks",
    price: "$320",
    priceSuffix: ".00",
    desc: "modern equipment for accurate diagnosis",
  },
];

const ServicesGrid = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { ref, isInView } = useInViewAnimation();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section ref={ref} className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-12 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 leading-[1.1]">
              Platform<br />Services
            </h2>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end gap-3">
            <p className="text-sm text-gray-500 max-w-xs md:text-right">
              We provide a wide range of contract services, covering all of your business needs.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-full px-5 py-2.5 hover:bg-gray-50 transition-colors"
            >
              Make an Appointment <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Drag indicator */}
        <div
          className={`flex items-center justify-center gap-2 text-xs text-gray-400 mb-6 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          <span>{"<"}</span>
          <GripHorizontal size={14} />
          <span>DRAG</span>
          <span>{">"}</span>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing scrollbar-hide"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {services.map((s, i) => (
            <div
              key={i}
              className={`min-w-[300px] md:min-w-[340px] border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex-shrink-0 ${isInView ? "animate-fade-in-up" : ""}`}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              {/* Image container */}
              <div className="relative rounded-xl overflow-hidden h-[240px]">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={640}
                  height={640}
                />
                {/* Floating pills */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                  {s.pills.map((pill) => (
                    <span
                      key={pill}
                      className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card content */}
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{s.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
                  <p className="text-3xl font-medium text-gray-900 mt-3">
                    {s.price}
                    <span className="text-lg text-gray-400">{s.priceSuffix}</span>
                  </p>
                </div>
                <a href="#" className="mt-1 text-gray-400 hover:text-gray-700 transition-colors">
                  <ArrowUpRight size={20} />
                </a>
              </div>

              <a href="#" className="inline-flex items-center gap-1 text-xs text-gray-500 mt-3 hover:text-gray-800 transition-colors">
                Learn more
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
