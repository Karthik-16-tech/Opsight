import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3500);
    }
  };

  return (
    <footer className="w-full bg-black text-white mt-4 sm:mt-6 lg:mt-8 py-12 sm:py-16 lg:py-20 overflow-hidden border-t border-white/[0.04]">
      {/* Full width container touching left and right borders */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-8">
          {/* AREA 1 — BRAND (Moved to left border, decreased size) */}
          <div className="flex flex-wrap items-center gap-x-3.5 sm:gap-x-4 gap-y-2">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* Opsight logo */}
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full bg-cyan-400/25 blur-[10px] pointer-events-none"
                  aria-hidden="true"
                />
                <img
                  src="/favicon.ico"
                  alt="Opsight Logo"
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(200,230,255,0.7)]"
                />
              </div>

              {/* Opsight Brand Title */}
              <span className="text-2xl sm:text-[26px] font-normal tracking-[-0.02em] text-white leading-none">
                Opsight
              </span>
            </div>

            {/* Thin vertical divider */}
            <div
              className="w-[1px] h-4 bg-white/20 flex-shrink-0"
              aria-hidden="true"
            />

            {/* Tagline beside brand */}
            <span className="text-[13px] sm:text-[14px] text-neutral-400 font-light tracking-normal leading-none whitespace-nowrap">
              Holographic AI Operations Agent
            </span>
          </div>

          {/* AREA 2 & 3 — PRODUCT & RESOURCES (Centered columns) */}
          <div className="flex items-start gap-12 sm:gap-16 lg:gap-20">
            {/* AREA 2 — PRODUCT COLUMN */}
            <div className="flex flex-col">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 mb-4">
                PRODUCT
              </span>
              <ul className="flex flex-col space-y-2.5 list-none p-0 m-0">
                {[
                  { name: "Home", href: "#main" },
                  { name: "Features", href: "#features" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "Docs", href: "#docs" },
                  { name: "Contact", href: "#contact" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-[13px] sm:text-[14px] font-light text-neutral-300 hover:text-white transition-colors duration-150"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* AREA 3 — RESOURCES COLUMN */}
            <div className="flex flex-col">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 mb-4">
                RESOURCES
              </span>
              <ul className="flex flex-col space-y-2.5 list-none p-0 m-0">
                {[
                  { name: "Blog", href: "#blog" },
                  { name: "Help Center", href: "#help-center" },
                  { name: "Community", href: "#community" },
                  { name: "Status", href: "#status" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-[13px] sm:text-[14px] font-light text-neutral-300 hover:text-white transition-colors duration-150"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AREA 4 — STAY UPDATED (Moved to right border, decreased size) */}
          <div className="flex flex-col w-full sm:w-[280px] lg:w-[300px]">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 mb-3">
              STAY UPDATED
            </span>
            <p className="text-[12px] sm:text-[13px] text-neutral-400 font-light leading-relaxed mb-4">
              Get the latest updates, features
              <br />
              and insights straight to your inbox.
            </p>

            {/* Email subscription field */}
            <form onSubmit={handleSubmit} className="relative w-full">
              <div className="relative flex items-center w-full rounded-full border border-white/20 bg-black/60 hover:border-white/30 focus-within:border-white/50 transition-colors p-1 pl-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={subscribed ? "Thank you for subscribing!" : "Your email address"}
                  disabled={subscribed}
                  className="w-full bg-transparent text-[13px] text-white placeholder-neutral-500 font-light focus:outline-none pr-2"
                  aria-label="Your email address"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ArrowRight size={13} strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
