import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const avatars = [
  { src: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100", top: "5%", left: "50%", bubble: "Finally, no payment chasing!" },
  { src: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100", top: "20%", left: "85%", bubble: "Contracts that actually execute" },
  { src: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100", top: "60%", left: "90%", bubble: null },
  { src: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100", top: "80%", left: "70%", bubble: null },
  { src: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100", top: "20%", left: "12%", bubble: null },
  { src: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100", top: "65%", left: "8%", bubble: "Game changer for procurement" },
];

const OrbitalTestimonials = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        <div className="relative mx-auto w-full max-w-[600px] aspect-square">
          <div className="absolute inset-0 rounded-full border border-gray-100" />
          <div className="absolute inset-[15%] rounded-full border border-gray-100" />
          <div className="absolute inset-[30%] rounded-full border border-gray-50" />

          {avatars.map((a, i) => (
            <div
              key={i}
              className={`absolute ${isInView ? "animate-fade-in-up" : ""}`}
              style={{ top: a.top, left: a.left, transform: "translate(-50%, -50%)", animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="relative">
                <img src={a.src} alt="Client" className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 border-white shadow-md" loading="lazy" />
                {a.bubble && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-50 text-gray-700 text-[10px] md:text-xs px-3 py-1 rounded-full shadow-sm">
                    {a.bubble}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div
            className={`absolute inset-0 flex items-center justify-center ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="text-2xl md:text-4xl font-medium text-gray-900 text-center leading-tight max-w-[300px]">
              Over 17k+ enterprise contracts executed on RicardianBase
            </h2>
          </div>
        </div>

        <div
          className={`mt-16 max-w-2xl mx-auto text-center ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.5s" }}
        >
          <img
            src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200"
            alt="Daniela Gilbert"
            className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
            loading="lazy"
          />

          <p className="mt-6 text-lg md:text-xl italic text-gray-800 leading-relaxed">
            "I want to express my deep gratitude to the RicardianBase platform and its smart contract infrastructure."
          </p>

          <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            When I had serious problems with contractor payment delays and contract disputes, I found myself
            in search of qualified solutions. My colleague recommended RicardianBase and it was the best advice
            I've ever been given. We reduced payment cycles from 45 days to 14 seconds.
          </p>

          <p className="mt-6 font-medium text-sm text-gray-900">Daniela Gilbert, Head of Procurement</p>
          <p className="text-xs text-gray-400 mt-1 italic">
            //This review emphasizes the professionalism and reliability of the RicardianBase platform//
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrbitalTestimonials;
