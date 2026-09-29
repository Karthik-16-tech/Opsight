export function AgentOrb({ message }: { message: string }) {
  return (
    <div className="pointer-events-none flex items-end gap-4">
      <div className="relative">
        <div
          className="relative h-32 w-32 rounded-full sm:h-40 sm:w-40"
          style={{
            background:
              "radial-gradient(42% 36% at 30% 22%, rgba(255,255,255,0.28), rgba(255,255,255,0.03) 38%, #05050a 66%), radial-gradient(circle at 72% 82%, rgba(120,90,255,0.4), transparent 52%)",
            boxShadow:
              "inset 0 -14px 40px rgba(120,90,255,0.22), inset 0 6px 24px rgba(255,255,255,0.08), 0 26px 60px -28px rgba(120,90,255,0.6)",
            animation: "drift 9s ease-in-out infinite",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(170,150,255,0.45)",
              maskImage: "linear-gradient(205deg, transparent 32%, black 78%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-4">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="h-10 w-[9px] rounded-full bg-white sm:h-12"
                style={{
                  boxShadow: "0 0 18px rgba(255,255,255,0.85)",
                  animation: `breathe ${3 + i * 0.4}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="mx-auto mt-1 h-8 w-24 rounded-full blur-xl"
          style={{ background: "rgba(130,100,255,0.3)" }}
        />
      </div>

      <div className="mb-12 max-w-[12rem] rounded-xl px-4 py-3 text-sm text-foreground/85 glass-hairline">
        {message}
      </div>
    </div>
  );
}
