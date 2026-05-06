import { type ReactNode } from "react";
import { motion } from "motion/react";
import { GlitchText } from "./components/glitch-text";
import { AsciiTitle } from "./components/ascii-title";
import { Scanlines } from "./components/scanlines";
import { SmoothScroll } from "./components/smooth-scroll";
import { WorksGallery } from "./components/WorksGallery"; // The new gallery component
import { TerminalGlitches } from "./components/terminal-glitches";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black text-white font-tronica relative">
      <SmoothScroll />
      <Scanlines />

      {/* HERO — full viewport */}
      <section className="relative z-10 flex h-screen w-full flex-col p-6 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.18) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(255,255,255,0.18) 0.5px, transparent 0.5px)",
            backgroundSize: "5px 5px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 90%)",
          }}
        />
        <TerminalGlitches />
        
        {/* TOP BAR */}
        <div className="grid grid-cols-4 items-start text-[11px] uppercase tracking-widest relative z-20">
          <div className="text-white font-extrabold">reymark</div>

          <nav className="flex flex-col gap-1">
            <a href="#works" className="hover:text-white/60 transition w-fit">
              <GlitchText>WORKS</GlitchText>
            </a>
            <a href="#about" className="hover:text-white/60 transition w-fit">
              <GlitchText>ABOUT</GlitchText>
            </a>
          </nav>

          <div className="flex flex-col gap-1 text-white/80">
            <a href="#" className="w-fit">
              <GlitchText>GITHUB ↗</GlitchText>
            </a>
            <a href="#contact" className="w-fit">
              <GlitchText>reymarkdesigns@gmail.com</GlitchText>
            </a>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <span>CREATIVE DEVELOPER</span>
            <span>MANILA, PHILIPPINES</span>
          </div>
        </div>

        {/* CENTER ASCII WORDMARK */}
        <div className="flex flex-1 items-center justify-center relative z-20">
          <AsciiTitle />
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-2 text-[11px] uppercase tracking-widest relative z-20">
          <div className="flex flex-col gap-1">
            <span>DIGITAL EXPERIENCES.</span>
            <span>REIMAGINED.</span>
          </div>
          <div className="text-right text-white/80 leading-relaxed">
            REYMARK IS A CREATIVE DEVELOPER FUSING HIGH-END<br />
            DESIGN WITH A DRIVE TO EXPLORE THE UNCONVENTIONAL...
          </div>
        </div>
      </section>

      {/* SELECTED WORKS — Frozen sticky scroll gallery with curtain transition */}
      <div id="works" className="relative z-10 border-t border-white/10">
        <WorksGallery works={WORKS} />
      </div>

      {/* ABOUT ME & TECH STACK */}
      <section id="about" className="relative z-10 border-t border-white/10 px-6 py-32">
        <Reveal>
          <div className="mb-8 text-[11px] uppercase tracking-widest text-white/50">
            &gt; whoami
          </div>
        </Reveal>
        
        <Reveal delay={0.1}>
          <h2 className="max-w-5xl text-3xl uppercase leading-[1.05] md:text-5xl">
            i design. i code. i deploy.<br />
            <span className="text-white/60">building interfaces made from passion._</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-[12px] leading-relaxed text-white/70 uppercase tracking-widest">
            I am a creative developer bridging the gap between brutalist design and fluid engineering. 
            Obsessed with performance, interactive animations, and crafting unconventional digital architectures.
          </p>
        </Reveal>

        {/* TECH STACK */}
        <div className="mt-24">
          <Reveal>
            <div className="mb-8 text-[11px] uppercase tracking-widest text-white/50">
              &gt; ls ./tech_stack
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 text-[11px] uppercase tracking-widest">
            {TECH_STACK.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="border-t border-white/20 pt-3">
                  <div className="mb-3 text-white/50">[{s.code}] {s.label}</div>
                  <ul className="space-y-1 text-white/80 normal-case tracking-normal">
                    {s.items.map((it) => (
                      <li key={it}>&gt; {it}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 border-t border-white/10 px-6 py-32 bg-black">
        <Reveal>
          <div className="mb-8 text-[11px] uppercase tracking-widest text-white/50">
            &gt; ./initiate_contact.sh
          </div>
        </Reveal>
        
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-6xl uppercase leading-[1.05] mb-16">
            let's build <br />
            <span className="text-white/60">something._</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[11px] uppercase tracking-widest">
            <div>
              <div className="text-white/50 mb-4 border-b border-white/20 pb-2 w-fit">STATUS</div>
              <div className="text-white mb-8">AVAILABLE FOR FREELANCE & COLLABORATION</div>
              <a href="mailto:reymarkdesigns@gmail.com" className="text-xl md:text-3xl hover:text-white/60 transition-colors block">
                <GlitchText>REYMARKDESIGNS@GMAIL.COM</GlitchText>
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-white/50 mb-4 border-b border-white/20 pb-2 w-fit">NETWORK</div>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="hover:text-white/60 flex items-center gap-2">
                      <GlitchText>GITHUB ↗</GlitchText>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white/60 flex items-center gap-2">
                      <GlitchText>LINKEDIN ↗</GlitchText>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white/60 flex items-center gap-2">
                      <GlitchText>TWITTER ↗</GlitchText>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-white/50 mb-4 border-b border-white/20 pb-2 w-fit">LOCATION</div>
                <p className="text-white/80 leading-relaxed">
                  MANILA, PHILIPPINES<br />
                  UTC+8 / REMOTE
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ASCII FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-6 pt-16 pb-6">
        <div className="flex justify-center">
          <AsciiTitle />
        </div>
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-4 text-[10px] tracking-widest text-white/40 uppercase gap-4">
          <span>&gt; END_OF_TRANSMISSION</span>
          <span>© 2026 ALL RIGHTS RESERVED</span>
          <a href="#" className="hover:text-white">
            <GlitchText>↑ BACK_TO_TOP</GlitchText>
          </a>
        </div>
      </footer>
    </div>
  );
}

const WORKS = [
  {
    title: "NIGHTOGRAPHY",
    client: "SAMSUNG",
    type: "COMMERCIAL",
    date: "2026",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=3174&auto=format&fit=crop",
  },
  {
    title: "KÄSY",
    client: "MCDONALDS",
    type: "COMMERCIAL",
    date: "2025",
    image: "https://images.unsplash.com/photo-1606851094655-b25cb28d8914?q=80&w=3174&auto=format&fit=crop",
  },
  {
    title: "ECHO/CHAMBER",
    client: "SONY",
    type: "MUSIC VIDEO",
    date: "2025",
    image: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4f0?q=80&w=3174&auto=format&fit=crop",
  },
  {
    title: "AFTERGLOW",
    client: "NIKE",
    type: "BRAND FILM",
    date: "2024",
    image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=3174&auto=format&fit=crop",
  },
];

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const TECH_STACK = [
  {
    code: "01",
    label: "FRONTEND",
    items: ["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    code: "02",
    label: "CREATIVE DEV",
    items: ["Three.js / WebGL", "GSAP / Motion", "Canvas API", "Shaders (GLSL)"],
  },
  {
    code: "03",
    label: "BACKEND",
    items: ["Node.js", "PostgreSQL", "Supabase", "REST & GraphQL"],
  },
  {
    code: "04",
    label: "DESIGN / TOOLS",
    items: ["Figma", "Adobe Creative Suite", "Git / Vercel", "Cursor / AI Workflows"],
  },
];