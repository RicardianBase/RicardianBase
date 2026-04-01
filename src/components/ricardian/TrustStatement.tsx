import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "1",
    title: "SMART\nESCROW",
    desc: "Automated milestone-based escrow payments in USDC & PYUSD",
    video: "https://images.pexels.com/videos/3129671/free-video-3129671.mp4",
    details: [
      "Company deposits stablecoins into the smart contract's escrow upon contract creation.",
      "Funds are visible to both parties but locked until milestones are approved.",
      "When approved, payment releases instantly — no invoices, no delays.",
    ],
  },
  {
    num: "2",
    title: "RICARDIAN\nLINKING",
    desc: "Cryptographic hash binding legal prose to smart contracts",
    video: "https://images.pexels.com/videos/3129957/free-video-3129957.mp4",
    details: [
      "Simultaneously generates a human-readable legal PDF and a matching Base smart contract.",
      "A cryptographic hash permanently links the two — creating tamper-proof bond.",
      "Any post-signing modification is instantly detectable via hash mismatch.",
    ],
  },
  {
    num: "3",
    title: "AUTO\nEXECUTION",
    desc: "Click approve → instant stablecoin settlement on Base",
    video: "https://images.pexels.com/videos/3130284/free-video-3130284.mp4",
    details: [
      "Contractor submits deliverables through the platform for each milestone.",
      "Company clicks 'Approve' — smart contract instantly releases payment.",
      "Full audit trail stored permanently on Base blockchain for compliance.",
    ],
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (hovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);

  return (
    <div
      className="service-card relative border border-border bg-background p-6 md:p-8 flex flex-col justify-between cursor-pointer overflow-hidden group"
      style={{ minHeight: "420px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number */}
      <span className="text-lg md:text-xl font-bold text-foreground">{service.num}</span>

      {/* Hover video overlay */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={service.video}
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <span className="text-xs text-white/70 uppercase tracking-wider">Explore</span>
          <h3
            className="text-2xl md:text-3xl font-black text-white leading-none mt-1 uppercase"
            style={{ letterSpacing: "-1px" }}
          >
            {service.title.replace("\n", " ")}
          </h3>
        </div>
      </div>

      {/* Bottom content */}
      <div className="mt-auto">
        <h3
          className="text-3xl md:text-4xl lg:text-[42px] font-black text-foreground leading-[0.95] uppercase"
          style={{ letterSpacing: "-1.5px" }}
        >
          {service.title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h3>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{service.desc}</p>
      </div>
    </div>
  );
};

const TrustStatement = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current;
    if (!section || !headline || !cards) return;

    const ctx = gsap.context(() => {
      // Pin the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
        },
      });

      // Headline scrolls up and scales down
      tl.to(headline, {
        y: "-60vh",
        scale: 0.6,
        opacity: 0.15,
        ease: "none",
      }, 0);

      // Cards rise up from below
      tl.fromTo(
        cards,
        { y: "80vh", opacity: 0 },
        { y: 0, opacity: 1, ease: "none" },
        0
      );

      // Stagger individual cards
      const cardEls = cards.querySelectorAll(".service-card");
      cardEls.forEach((card, i) => {
        tl.fromTo(
          card,
          { y: 60 + i * 30, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0.2 + i * 0.05
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Large bold headline — scrolls up on scroll */}
      <div
        ref={headlineRef}
        className="absolute inset-0 flex items-center justify-center z-0 px-4"
      >
        <div className="text-center">
          <h2
            className="text-[12vw] md:text-[10vw] lg:text-[9vw] font-black text-foreground leading-[0.85] uppercase"
            style={{ letterSpacing: "-4px" }}
          >
            RICARDIAN
            <br />
            <span className="inline-block ml-[5vw]">PLATFORM</span>
            <br />
            SERVICES
            <span className="text-muted-foreground">(3)</span>
          </h2>
        </div>
      </div>

      {/* Cards container — rises up from below */}
      <div
        ref={cardsRef}
        className="relative z-10 flex items-end justify-center px-4 md:px-8"
        style={{ minHeight: "100vh", paddingBottom: "3rem", paddingTop: "50vh" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl w-full">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStatement;
