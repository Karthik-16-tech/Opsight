import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import futureStateImage from "@/assets/feautures/future-state.jpg";
import karaAgentImage from "@/assets/feautures/kara-agent.jpg";
import neuralSystemsImage from "@/assets/feautures/neural-systems.jpg";
import newInterfacesImage from "@/assets/feautures/new-interfaces.jpg";

const projects = [
  {
    id: "01",
    eyebrow: "AI AGENT",
    statusText: "Connected",
    title: "Ai Agent",
    headline: "Hi, I’m Kara.",
    statement: ["BUILDING INTELLIGENT", "SYSTEMS FOR A SMARTER", "TOMORROW."],
    description: "Autonomous agent systems for research, automation and creative workflows.",
    image: karaAgentImage,
    imageAlt: "Kara, a humanoid AI agent in a dark technology laboratory",
  },
  {
    id: "02",
    eyebrow: "SYNTHETIC MIND",
    statusText: "Active",
    title: "Neural Systems",
    headline: "Think beyond.",
    statement: ["ADAPTIVE EXPERIENCES", "SHAPED BY SIGNAL,", "NOT ASSUMPTION."],
    description: "Experimental interfaces that learn, adapt and evolve with every interaction.",
    image: neuralSystemsImage,
    imageAlt: "A luminous neural system suspended inside a precision research chamber",
  },
  {
    id: "03",
    eyebrow: "HUMAN / MACHINE",
    statusText: "Synced",
    title: "New Interfaces",
    headline: "Closer to human.",
    statement: ["DESIGNING THE SPACE", "BETWEEN INTENTION", "AND ACTION."],
    description: "Quiet, intuitive interaction models for the next generation of digital products.",
    image: newInterfacesImage,
    imageAlt: "A hand interacting with a refined transparent digital interface",
  },
  {
    id: "04",
    eyebrow: "FUTURE STATE",
    statusText: "Live",
    title: "Tomorrow, now",
    headline: "Built for change.",
    statement: ["EXPLORING SYSTEMS", "THAT MOVE WITH", "THE WORLD."],
    description: "A living collection of research, prototypes and speculative product concepts.",
    image: futureStateImage,
    imageAlt: "An illuminated adaptive city model in a dark design studio",
  },
];

// Helper for smooth stepped holding and easing between cards
function calculateVirtualIndex(p: number, total: number) {
  const steps = total - 1;
  const raw = p * steps;
  const step = Math.floor(raw);
  const frac = raw - step;

  if (step >= steps) return steps;

  // Hold each card for 35% of its interval, transition in the remaining 65%
  const hold = 0.35;
  if (frac < hold) {
    return step;
  }
  const t = (frac - hold) / (1 - hold);
  // Smooth cubic easeInOut
  const ease = t * t * (3 - 2 * t);
  return step + ease;
}

export function FeaturesGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardDomsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let targetVirtual = 0;
    let currentVirtual = 0;
    let animId = 0;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      targetVirtual = calculateVirtualIndex(progress, projects.length);
    };

    const updateRender = () => {
      // Lerp for smooth kinetic feel
      currentVirtual += (targetVirtual - currentVirtual) * 0.12;
      if (Math.abs(targetVirtual - currentVirtual) < 0.001) {
        currentVirtual = targetVirtual;
      }

      const activeIdx = Math.min(projects.length - 1, Math.max(0, Math.round(currentVirtual)));
      setActiveIndex(activeIdx);

      // Compute style transforms for each card
      projects.forEach((_, i) => {
        const dom = cardDomsRef.current[i];
        if (!dom) return;

        const offset = currentVirtual - i;

        let x = 0;
        let y = 0;
        let opacity = 0;
        let scale = 1;

        if (offset < 0) {
          // Card is upcoming (enters horizontally from down)
          const absOff = Math.min(1, Math.abs(offset));
          // Enters from +105% x and +50px y
          x = absOff * 105;
          y = absOff * 50;
          opacity = Math.max(0, 1 - absOff * 1.4);
          scale = 1 - absOff * 0.04;
        } else if (offset > 0) {
          // Card has passed (slides out horizontally to the left)
          const off = Math.min(1, offset);
          x = -off * 55;
          y = -off * 20;
          opacity = Math.max(0, 1 - off * 1.5);
          scale = 1 - off * 0.05;
        } else {
          // Exactly active
          x = 0;
          y = 0;
          opacity = 1;
          scale = 1;
        }

        // Apply via direct transform for zero-overhead 60fps rendering
        dom.style.transform = `translate3d(${x}%, ${y}px, 0) scale(${scale})`;
        dom.style.opacity = `${opacity}`;
        dom.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      });

      animId = requestAnimationFrame(updateRender);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    updateRender();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative bg-black text-white mt-28 sm:mt-36 lg:mt-48"
      style={{ height: "380vh" }}
      aria-label="Selected work and explorations"
    >
      {/* Sticky full-screen viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        {/* Subtle background ambient glow */}
        <div
          className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-cyan-500/[0.02] rounded-full blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Pinned Text (Selected work & explorations) */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-[3.6rem] font-light tracking-[-0.03em] leading-[1.08] text-white">
                Selected work
                <br />
                &amp; explorations
              </h1>

              {/* View dashboard link */}
              <div className="mt-7 sm:mt-10 flex items-center gap-6">
                <a
                  href="/dashboard"
                  className="group inline-flex items-center gap-3 text-xs sm:text-[12px] uppercase font-mono tracking-[0.16em] text-neutral-300 border-b border-white/20 pb-1.5 hover:text-white hover:border-white transition-colors"
                >
                  <span>VIEW DASHBOARD</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>

                {/* Counter indicator */}
                <div className="text-xs font-mono text-neutral-500">
                  <span className="text-white font-medium">0{activeIndex + 1}</span> / 0{projects.length}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Single Decreased-size Card Frame with horizontal scroll-in animation */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              {/* Outer frame container with decreased card size */}
              <div
                id="project-cards"
                className="relative w-full max-w-[480px] sm:max-w-[530px] lg:max-w-[570px] h-[370px] sm:h-[400px] lg:h-[430px]"
              >
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    ref={(el) => {
                      cardDomsRef.current[index] = el;
                    }}
                    className="absolute inset-0 w-full h-full flex flex-col justify-between will-change-transform"
                    style={{
                      transform: index === 0 ? "translate3d(0, 0, 0)" : "translate3d(105%, 50px, 0)",
                      opacity: index === 0 ? 1 : 0,
                    }}
                    aria-hidden={activeIndex !== index}
                  >
                    {/* Media Card (compact decreased size) */}
                    <div className="relative w-full h-[270px] sm:h-[300px] lg:h-[330px] rounded-xl overflow-hidden border border-white/[0.12] bg-[#0c0d0e] shadow-2xl group">
                      {/* Image */}
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 group-hover:scale-[1.02]"
                        loading={index === 0 ? "eager" : "lazy"}
                      />

                      {/* Dark Vignette / Gradient overlays */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none"
                        aria-hidden="true"
                      />

                      {/* Top Overlay: Status Badge + Statement */}
                      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 right-4 sm:right-5 flex flex-col items-start z-10 pointer-events-none">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/60 backdrop-blur-md px-3 py-1 mb-2.5 shadow-md">
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
                            aria-hidden="true"
                          />
                          <div className="flex flex-col text-left">
                            <span className="text-[9px] font-semibold uppercase tracking-wider text-white">
                              {project.eyebrow}
                            </span>
                            <span className="text-[8.5px] text-emerald-400 font-light">
                              {project.statusText}
                            </span>
                          </div>
                        </div>

                        {/* Statement */}
                        <div className="text-[9px] sm:text-[9.5px] font-mono tracking-[0.14em] uppercase text-neutral-300 leading-tight space-y-0.5 text-left max-w-xs drop-shadow-md">
                          {project.statement.map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Headline inside image */}
                      <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 z-10 pointer-events-none">
                        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-light tracking-tight text-white inline-block border-b border-white/25 pb-0.5 drop-shadow-lg">
                          {project.headline}
                        </h2>
                      </div>
                    </div>

                    {/* Footer Row below the Media Card */}
                    <div className="flex items-start justify-between gap-3 pt-3 px-1 text-left">
                      <div className="max-w-[360px]">
                        <h3 className="text-base sm:text-[17px] font-normal text-white mb-0.5 tracking-tight">
                          {project.title}
                        </h3>
                        <p className="text-[11.5px] sm:text-[12px] text-neutral-400 font-light leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <a
                        href={`#${project.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="group flex-shrink-0 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-neutral-300 border-b border-white/20 pb-0.5 hover:text-white hover:border-white transition-colors"
                      >
                        <span>EXPLORE PROJECT</span>
                        <ArrowRight
                          size={12}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesGallery;
