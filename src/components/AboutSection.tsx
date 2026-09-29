import { motion } from "framer-motion";
import { Mail, FileText, Image as ImageIcon, Code2, Search, Settings } from "lucide-react";

const tools = [
  {
    icon: Mail,
    title: "Write emails and replies",
    description:
      "Save time with AI-powered OPSIGHT recommendations to craft professional incident reports, status updates and stakeholder emails — in seconds.",
  },
  {
    icon: FileText,
    title: "Read pdf and attachments",
    description:
      "Get instant insights from your PDF runbooks, logs and architecture attachments with OPSIGHT. Simply upload and ask — no more manual reading.",
  },
  {
    icon: ImageIcon,
    title: "Scan images",
    description:
      "Upload architecture diagrams, screenshots and trace graphs. Let OPSIGHT analyze them with AI to get instant descriptions, extracted data and insights.",
  },
  {
    icon: Code2,
    title: "Write code & programs",
    description:
      "Turn your diagnostic ideas into working remediation code and rollback scripts with OPSIGHT. Get clean, efficient and well-structured code for any stack.",
  },
  {
    icon: Search,
    title: "Research",
    description:
      "Find accurate and up-to-date telemetry and historical knowledge with OPSIGHT. Get detailed summaries, root cause correlations and trusted sources.",
  },
  {
    icon: Settings,
    title: "Automation",
    description:
      "Streamline your incident response workflow with AI automation. Let OPSIGHT handle repetitive diagnosis tasks, so you can focus on what matters.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 bg-black relative text-white overflow-hidden border-t border-white/[0.03]">
      {/* Background subtle ambient glow */}
      <div
        className="absolute top-1/3 left-10 w-[500px] h-[300px] bg-white/[0.012] rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Moved close to the left border / edge */}
      <div className="w-full pl-4 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 pr-6 sm:pr-10 max-w-[1480px] relative z-10 text-left">
        {/* Header Block with decreased text & heading size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-left"
        >
          {/* Subtle line indicator */}
          <span className="w-8 h-[1.5px] bg-white/70 block mb-5" aria-hidden="true" />

          {/* Heading - decreased in size */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-light text-white tracking-tight leading-[1.2]">
            Explore the Powerful Tools
            <br />
            <span className="font-semibold text-white">OPSIGHT AI</span> Brings to You
          </h2>

          {/* Subtitle - decreased in size */}
          <p className="text-xs sm:text-[13px] text-neutral-400 mt-3 font-light tracking-wide max-w-lg">
            Smarter tools. Faster workflows. Endless possibilities.
          </p>
        </motion.div>

        {/* 3-Column Tools Grid - moved to left border, decreased sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-12 lg:gap-x-14 gap-y-10 sm:gap-y-12">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col items-start cursor-default"
              >
                {/* Compact round badge with icon */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center text-white mb-3.5 transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/[0.09] group-hover:shadow-[0_0_14px_rgba(255,255,255,0.18)] group-hover:scale-105">
                  <Icon size={17} strokeWidth={1.6} />
                </div>

                {/* Title - decreased size */}
                <h3 className="text-[14px] sm:text-[15px] font-medium text-white mb-1.5 tracking-tight group-hover:text-white transition-colors">
                  {tool.title}
                </h3>

                {/* Description - decreased size */}
                <p className="text-[12px] sm:text-[13px] text-neutral-400 font-light leading-relaxed group-hover:text-neutral-300 transition-colors">
                  {tool.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
