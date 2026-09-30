interface AgentOrbProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  status?: "incident" | "healthy";
  onClick?: () => void;
  className?: string;
}

export function AgentOrb({
  message,
  size = "md",
  status = "incident",
  onClick,
  className = "",
}: AgentOrbProps) {
  const isSmall = size === "sm";
  const isLarge = size === "lg";

  const orbSizeClass = isSmall
    ? "h-14 w-14"
    : isLarge
    ? "h-36 w-36 sm:h-44 sm:w-44"
    : "h-28 w-28 sm:h-32 sm:w-32";

  const eyeSizeClass = isSmall
    ? "h-4 w-[4px]"
    : isLarge
    ? "h-11 w-[10px]"
    : "h-8 w-[7px]";

  const eyeGapClass = isSmall ? "gap-1.5" : isLarge ? "gap-4" : "gap-2.5";

  const auraBackground =
    status === "incident"
      ? "radial-gradient(42% 36% at 30% 22%, rgba(255,255,255,0.32), rgba(255,255,255,0.04) 38%, #07050e 66%), radial-gradient(circle at 72% 82%, rgba(168,85,247,0.55), transparent 55%)"
      : "radial-gradient(42% 36% at 30% 22%, rgba(255,255,255,0.32), rgba(255,255,255,0.04) 38%, #03080a 66%), radial-gradient(circle at 72% 82%, rgba(16,185,129,0.55), transparent 55%)";

  const auraBoxShadow =
    status === "incident"
      ? "inset 0 -10px 30px rgba(168,85,247,0.35), inset 0 6px 20px rgba(255,255,255,0.1), 0 16px 45px -15px rgba(168,85,247,0.7)"
      : "inset 0 -10px 30px rgba(16,185,129,0.35), inset 0 6px 20px rgba(255,255,255,0.1), 0 16px 45px -15px rgba(16,185,129,0.7)";

  const bottomBlur =
    status === "incident"
      ? "rgba(168,85,247,0.4)"
      : "rgba(16,185,129,0.4)";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 ${onClick ? "cursor-pointer" : "pointer-events-none"} ${className}`}
    >
      <div className="relative shrink-0">
        <div
          className={`relative rounded-full transition-transform hover:scale-105 ${orbSizeClass}`}
          style={{
            background: auraBackground,
            boxShadow: auraBoxShadow,
            animation: "drift 7s ease-in-out infinite, orbPulse 4s ease-in-out infinite",
          }}
        >
          {/* Rim light highlight */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid ${status === "incident" ? "rgba(192,132,252,0.5)" : "rgba(52,211,153,0.5)"}`,
              maskImage: "linear-gradient(205deg, transparent 32%, black 78%)",
            }}
          />

          {/* Glowing Breathing Eyes */}
          <div className={`absolute inset-0 flex items-center justify-center ${eyeGapClass}`}>
            {[0, 1].map((i) => (
              <span
                key={i}
                className={`rounded-full bg-white transition-all ${eyeSizeClass}`}
                style={{
                  boxShadow: "0 0 14px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.8)",
                  animation: `breathe ${2.6 + i * 0.35}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Ambient bottom floor blur */}
        <div
          aria-hidden
          className="mx-auto mt-0.5 h-4 w-16 rounded-full blur-md"
          style={{ background: bottomBlur }}
        />
      </div>

      {message && (
        <div className="max-w-[14rem] rounded-xl px-3.5 py-2.5 text-xs text-white/90 bg-black/75 backdrop-blur-xl border border-white/15 shadow-xl leading-relaxed">
          {message}
        </div>
      )}
    </div>
  );
}

export default AgentOrb;
