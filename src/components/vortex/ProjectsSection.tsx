import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Lumina Brand Identity",
    tag: "Branding",
    image: "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/1.gif",
  },
  {
    title: "Drift Product Design",
    tag: "Product",
    image: "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/3.gif",
  },
  {
    title: "Outline Design System",
    tag: "Systems",
    image: "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/5.gif",
  },
];

const ProjectsSection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2
          className={`text-3xl md:text-4xl text-[#051A24] mb-12 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          Selected work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className={`group cursor-pointer ${isInView ? "animate-fade-in-up" : ""}`}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-[300px] md:h-[360px] object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <h3 className="text-base font-medium text-[#051A24]">{p.title}</h3>
                  <p className="text-xs text-[#273C46] mt-0.5">{p.tag}</p>
                </div>
                <ArrowUpRight size={18} className="text-[#273C46] group-hover:text-[#051A24] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
