import VortexButton from "./VortexButton";

const FixedBottomNav = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] px-3 py-2 flex items-center gap-3">
        <span
          className="text-lg font-semibold text-[#051A24] px-3"
          style={{ fontFamily: "'PP Mondwest', serif" }}
        >
          V
        </span>
        <VortexButton variant="primary" className="text-xs px-5 py-2">
          Start a chat
        </VortexButton>
      </div>
    </div>
  );
};

export default FixedBottomNav;
