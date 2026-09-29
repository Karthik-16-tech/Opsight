import { ArrowRight, Mic } from "lucide-react";
import { useState } from "react";

export function CommandBar({
  onSubmit,
}: {
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSubmit?.(value.trim());
        setValue("");
      }}
      className="flex w-full items-center gap-4 rounded-full py-2.5 pl-2.5 pr-2.5 glass-hairline"
      style={{ borderRadius: 9999 }}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Mic className="h-4 w-4 text-foreground/80" />
      </span>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about the incident..."
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />

      <div aria-hidden className="hidden items-end gap-[3px] sm:flex">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-primary/70"
            style={{
              height: 6 + ((i * 7) % 18),
              animation: `wave ${1.1 + (i % 5) * 0.16}s ease-in-out ${
                i * 0.05
              }s infinite`,
            }}
          />
        ))}
      </div>

      <button
        type="submit"
        aria-label="Send"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-colors hover:bg-white/12 cursor-pointer"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
