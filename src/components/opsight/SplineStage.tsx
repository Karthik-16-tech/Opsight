import { useEffect, useRef, useState } from "react";

const SCENE_URL = "https://prod.spline.design/kgLspzW6s4j0G9EM/scene.splinecode";
const VIEWER_SRC =
  "https://cdn.spline.design/@splinetool/viewer@2.0.59/build/spline-viewer.js";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { url?: string; "events-target"?: string };
    }
  }
}

export function SplineStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const mount = () => {
      if (cancelled || !hostRef.current || hostRef.current.childElementCount) return;
      const viewer = document.createElement("spline-viewer");
      viewer.setAttribute("url", SCENE_URL);
      viewer.setAttribute("events-target", "global");
      viewer.style.width = "100%";
      viewer.style.height = "100%";
      viewer.style.background = "transparent";
      viewer.addEventListener("load", () => setReady(true));
      hostRef.current.appendChild(viewer);
      // Fallback in case the load event never fires.
      window.setTimeout(() => setReady(true), 6000);
    };

    if (customElements.get("spline-viewer")) {
      mount();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${VIEWER_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener("load", mount);
      } else {
        const script = document.createElement("script");
        script.type = "module";
        script.src = VIEWER_SRC;
        script.addEventListener("load", mount);
        document.head.appendChild(script);
      }
      customElements.whenDefined("spline-viewer").then(mount);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="absolute inset-0">
      {/* atmospheric depth behind the scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 20% 48%, color-mix(in oklab, var(--color-halo) 14%, transparent), transparent 70%)",
        }}
      />

      <div
        ref={hostRef}
        className="absolute inset-y-0 left-0 w-[105%] lg:w-[110%] -translate-x-[32%] sm:-translate-x-[34%] lg:-translate-x-[36%] scale-[0.88] sm:scale-[0.92] lg:scale-[0.95] origin-center"
      />

      {/* edge dissolve so the 3D world has no visible boundary */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 80% at 18% 50%, transparent 40%, #000 92%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{ background: "linear-gradient(to top, #000, transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(to bottom, #000, transparent)" }}
      />

      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground animate-[breathe_2.4s_ease-in-out_infinite]">
            Initializing environment
          </span>
        </div>
      )}
    </div>
  );
}
