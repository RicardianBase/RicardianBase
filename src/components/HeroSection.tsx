import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassButton } from "@/components/ui/glass-button";
import { useWallet } from "@/contexts/WalletContext";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isConnected, address, openModal, disconnect } = useWallet();

  const truncatedAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  const handleGetStarted = () => {
    if (!isConnected) {
      openModal();
    } else {
      window.location.href = "/dashboard";
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const loop = () => {
      if (!video.duration) {
        rafId = requestAnimationFrame(loop);
        return;
      }
      const t = video.currentTime;
      const d = video.duration;

      if (t < 0.5) {
        video.style.opacity = String(Math.min(t / 0.5, 1));
      } else if (t > d - 0.5) {
        video.style.opacity = String(Math.max((d - t) / 0.5, 0));
      } else {
        video.style.opacity = "1";
      }

      rafId = requestAnimationFrame(loop);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener("ended", handleEnded);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute object-cover w-full h-full"
        style={{ top: "300px", inset: "auto 0 0 0", opacity: 0 }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4"
        muted
        autoPlay
        playsInline
      />
      {/* Gradient overlays on video */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <span
          className="text-3xl tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Ricardian<sup className="text-xs align-super">®</sup>
        </span>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Product", active: true },
            { label: "Solutions", active: false },
            { label: "Company", active: false },
            { label: "Resources", active: false },
            { label: "Contact", active: false },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="text-sm transition-colors"
              style={{ color: item.active ? "#000000" : "#6F6F6F" }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Connect Wallet */}
          {isConnected ? (
            <button
              onClick={disconnect}
              className="hidden md:flex items-center gap-2 border border-[hsl(140,38%,38%)]/30 bg-[hsl(140,38%,38%)]/5 text-[hsl(140,38%,38%)] text-sm px-4 py-2.5 rounded-full hover:bg-[hsl(140,38%,38%)]/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
              {truncatedAddress}
            </button>
          ) : (
            <button
              onClick={openModal}
              className="hidden md:flex items-center gap-2 border border-[#00000020] text-sm px-4 py-2.5 rounded-full hover:bg-[#00000008] transition-colors"
              style={{ color: "#6F6F6F" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
              Connect
            </button>
          )}

          {/* Get Started */}
          <button
            onClick={handleGetStarted}
            className="rounded-full px-6 py-2.5 text-sm text-white transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: "#000000" }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero content */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[calc(100vh-88px)]"
      >
        <h1
          className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal animate-fade-rise"
          style={{
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 0.95,
            letterSpacing: "-2.46px",
            color: "#000000",
          }}
        >
          Scale contracts,{" "}
          <em style={{ color: "hsl(140, 38%, 38%)" }}>guarantee</em>{" "}
          every payment.
        </h1>

        <p
          className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay"
          style={{ color: "#6F6F6F" }}
        >
          Building trustless infrastructure for hiring managers, procurement teams, and tech contractors.
          Through Ricardian smart contracts on Base, we make payments instant, automatic, and legally binding.
        </p>

        {isConnected ? (
          <Link to="/dashboard" className="animate-fade-rise-delay-2 inline-block mt-12">
            <GlassButton contentClassName="px-14 py-5 text-lg">
              Explore Platform
            </GlassButton>
          </Link>
        ) : (
          <div className="animate-fade-rise-delay-2 inline-block mt-12">
            <GlassButton contentClassName="px-14 py-5 text-lg" onClick={openModal}>
              Explore Platform
            </GlassButton>
          </div>
        )}
      </section>
    </div>
  );
};

export default HeroSection;
