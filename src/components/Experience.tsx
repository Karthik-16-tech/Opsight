import { motion, useInView } from "framer-motion";
import { Activity, Brain, Network, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

const features = [
  {
    icon: Activity,
    title: "Automatic Incident Detection",
    description:
      "Detect payment failures, API errors, latency spikes and database issues automatically as they happen",
    videoUrl: "https://videos.pexels.com/video-files/4460100/4460100-hd_1920_1080_30fps.mp4",
  },
  {
    icon: Brain,
    title: "Hindsight Memory",
    description:
      "Remember previous incidents, root causes and successful resolutions to improve future investigations.",
    videoUrl: "https://videos.pexels.com/video-files/4280450/4280450-hd_1920_1080_30fps.mp4",
  },
  {
    icon: Network,
    title: "Visual System Analysis",
    description:
      "See your application's services, APIs and databases and understand exactly where an incident is occurring.",
    videoUrl: "https://videos.pexels.com/video-files/5487781/5487781-hd_1920_1080_30fps.mp4",
  },
  {
    icon: Sparkles,
    title: "AI Root Cause Analysis",
    description:
      "Connect live evidence with past incidents to identify the likely cause and recommend the next steps.",
    videoUrl: "https://videos.pexels.com/video-files/4460098/4460098-hd_1920_1080_30fps.mp4",
  },
];

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="py-28 lg:py-36 bg-black relative" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-3 block font-medium">
            The Experience
          </span>
          <h2 className="text-2xl md:text-4xl font-light mb-3 text-white tracking-tight">
            Autonomous Incident Intelligence
          </h2>
          <p className="text-sm text-neutral-400 max-w-md mx-auto font-light">
            Continuous detection, instant memory correlation, and automated root cause analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 0, scale: 1 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative overflow-hidden bg-black/75 hover:bg-black/95 backdrop-blur-xl border border-white/10 hover:border-white/25 rounded-2xl p-6 group shadow-lg shadow-black/40 hover:shadow-2xl hover:shadow-black/80 cursor-pointer transition-all duration-500"
              >
                {/* Video Background on Hover */}
                <video
                  src={feature.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-35 transition-opacity duration-500 z-0 pointer-events-none"
                />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-5">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.07] border border-white/10 group-hover:bg-white/20 transition-colors duration-300">
                    <Icon className="h-5 w-5 text-white transition-colors duration-300" strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="text-base font-normal mb-1 text-white tracking-tight transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-neutral-400 group-hover:text-white/90 leading-relaxed font-light transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
