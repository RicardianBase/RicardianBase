import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const testimonials = [
  {
    quote: "Vortex elevated our brand to a level we didn't think was possible. Every detail was considered.",
    author: "Alex Chen",
    role: "CEO, Lumina",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    quote: "The craft and speed were unreal. It felt like having an in-house Apple design team.",
    author: "Maya Johnson",
    role: "Founder, Drift",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    quote: "Sarah's eye for detail transformed our product. Users immediately noticed the difference.",
    author: "James Park",
    role: "CTO, Outline",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    quote: "Worth every penny. The design system they built scaled beautifully across our entire platform.",
    author: "Priya Gupta",
    role: "VP Design, Forma",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    quote: "Vortex doesn't just design — they think strategically about every interaction.",
    author: "Tom Rivera",
    role: "Head of Product, Beam",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
];

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);
  const { ref, isInView } = useInViewAnimation();

  const next = useCallback(() => setCurrent((c) => (c + 1) % testimonials.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section ref={ref} className="bg-[#F6FCFF] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl text-[#051A24] mb-12 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          What{" "}
          <span style={{ fontFamily: "'PP Mondwest', serif" }}>builders</span>{" "}
          say
        </h2>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-full px-2">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm max-w-2xl">
                  <p className="text-lg md:text-xl text-[#051A24] leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3 mt-6">
                    <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-[#051A24]">{t.author}</p>
                      <p className="text-xs text-[#273C46]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-[#E0EBF0] flex items-center justify-center hover:bg-[#E0EBF0] transition-colors">
            <ChevronLeft size={18} className="text-[#051A24]" />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full border border-[#E0EBF0] flex items-center justify-center hover:bg-[#E0EBF0] transition-colors">
            <ChevronRight size={18} className="text-[#051A24]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
