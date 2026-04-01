const links = [
  { label: "Twitter", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "#" },
];

const VortexFooter = () => {
  return (
    <footer className="bg-white border-t border-[#E0EBF0]">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p
          className="text-xl font-semibold text-[#051A24]"
          style={{ fontFamily: "'PP Mondwest', serif" }}
        >
          V Vortex
        </p>
        <div className="flex gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-[#273C46] hover:text-[#051A24] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-[#E0EBF0] py-4 text-center text-xs text-[#273C46]">
        © {new Date().getFullYear()} Vortex Studio. All rights reserved.
      </div>
    </footer>
  );
};

export default VortexFooter;
