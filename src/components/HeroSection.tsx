import { Play } from "lucide-react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-28 pb-16">
        {/* Headline */}
        <h1 className="text-background">
          <span className="block font-barlow font-bold text-[clamp(28px,5vw,56px)] tracking-[-4px] leading-tight">
            Agency that makes your
          </span>
          <span className="block font-instrument italic text-[clamp(42px,7vw,84px)] leading-[1.1] mt-1">
            videos & reels viral
          </span>
        </h1>

        {/* Subtext */}
        <p className="font-barlow font-medium text-[clamp(14px,1.5vw,18px)] text-background/80 mt-6 max-w-lg">
          Short-form video editing for Influencers, Creators and Brands
        </p>

        {/* CTA */}
        <button className="mt-10 flex items-center gap-3 bg-background text-foreground font-barlow font-medium text-[16px] pl-5 pr-7 py-3.5 rounded-full shadow-[0_8px_32px_hsl(var(--foreground)/0.12)] hover:shadow-[0_8px_40px_hsl(var(--foreground)/0.2)] transition-shadow">
          <span className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center">
            <Play size={14} className="text-background ml-0.5" fill="currentColor" />
          </span>
          See Our Workreel
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
