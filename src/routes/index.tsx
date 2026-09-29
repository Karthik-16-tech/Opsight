import { createFileRoute, Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

import heroVideo from "@/assets/Untitled design (12).mp4";
import AboutSection from "@/components/AboutSection";
import Experience from "@/components/Experience";
import { FeaturesGallery } from "@/components/FeaturesGallery";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Opsight AI — Turn Your Work Into Bigger Opportunities" },
      {
        name: "description",
        content: "Connect, showcase, and grow with Opsight AI.",
      },
      { property: "og:title", content: "Opsight AI" },
      {
        property: "og:description",
        content: "Turn your work into bigger opportunities with Opsight AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = ["Home", "Features", "Experience", "About", "Contact"];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [previewNav, setPreviewNav] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const visibleNav = previewNav ?? activeNav;

  // Initialize GSAP + Lenis inline kinetic smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
    });

    lenisRef.current = lenis;

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Update active nav based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const aboutEl = document.getElementById("about");
      const expEl = document.getElementById("experience");
      const featEl = document.getElementById("features");
      const vh = window.innerHeight * 0.45;
      if (aboutEl && aboutEl.getBoundingClientRect().top <= vh) {
        setActiveNav("About");
      } else if (expEl && expEl.getBoundingClientRect().top <= vh) {
        setActiveNav("Experience");
      } else if (featEl && featEl.getBoundingClientRect().top <= vh) {
        setActiveNav("Features");
      } else {
        setActiveNav("Home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGlassPointer = (event: PointerEvent<HTMLElement>) => {
    const nav = navRef.current;
    if (!nav) return;
    const bounds = nav.getBoundingClientRect();
    nav.style.setProperty("--glass-x", `${event.clientX - bounds.left}px`);
    nav.style.setProperty("--glass-y", `${event.clientY - bounds.top}px`);
  };

  const handleNavClick = (item: string) => {
    setActiveNav(item);
    setMenuOpen(false);
    const targetId = item === "Home" ? "#main" : `#${item.toLowerCase()}`;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetId, {
        duration: 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <nav
          ref={navRef}
          className="liquid-nav"
          aria-label="Main navigation"
          onPointerMove={handleGlassPointer}
        >
          <div className="liquid-nav__shine" aria-hidden="true" />
          <a
            className="brand flex items-center gap-2"
            href="#main"
            aria-label="Opsight AI home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("Home");
            }}
          >
            <img src="/favicon.ico" alt="Opsight Logo" className="w-5 h-5 object-contain" />
            <span className="brand__name">OPSIGHT AI</span>
          </a>

          <div
            className="desktop-links"
            aria-label="Primary links"
            onMouseLeave={() => setPreviewNav(null)}
          >
            <span
              className="nav-link-indicator"
              style={{
                "--nav-index": Math.max(0, navItems.indexOf(visibleNav)),
              } as CSSProperties}
              aria-hidden="true"
            />
            {navItems.map((item) => (
              <a
                key={item}
                className={item === visibleNav ? "nav-link nav-link--active" : "nav-link"}
                href={item === "Home" ? "#main" : `#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
                onFocus={() => setPreviewNav(item)}
                onBlur={() => setPreviewNav(null)}
                onMouseEnter={() => setPreviewNav(item)}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <Button
              className="mobile-menu-button"
              variant="icon"
              size="icon"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {menuOpen && (
            <div className="mobile-menu">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={item === "Home" ? "#main" : `#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </nav>
      </header>

      <main className="hero-stage" id="main">
        <video
          ref={videoRef}
          className="hero-video"
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-shade" aria-hidden="true" />

        <section className="hero-content" aria-labelledby="hero-title">
          <h1 id="hero-title">
            Turn Your Work Into
            <br />
            Bigger Opportunities
          </h1>
          <p>Connect. Showcase. Grow.</p>
          <Button asChild variant="glass">
            <Link to="/dashboard">
              Get Started <ArrowRight size={17} strokeWidth={1.6} />
            </Link>
          </Button>
        </section>
      </main>

      {/* Features page below hero section */}
      <FeaturesGallery />

      {/* Experience section */}
      <Experience />

      {/* About section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

