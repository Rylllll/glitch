import { type ReactNode, useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { GlitchText } from "./components/glitch-text";
import { AsciiTitle } from "./components/ascii-title";
import { Scanlines } from "./components/scanlines";
import { SmoothScroll } from "./components/smooth-scroll";
import { WorksGallery } from "./components/WorksGallery"; 
import { TerminalGlitches } from "./components/terminal-glitches";
import { WorkOverview } from "./components/WorkOverview"; 
import { AboutSection } from "./components/about";

// --- IMPORT DATA HERE ---
import { WORKS, TECH_STACK } from "../data/data";

// --- NEW COMPONENT: GLOBAL CANVAS GLITCH (Moving Particles) ---
function GlobalGlitchBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];

    const chars = "0123456789!@#$%^&*()_+-=[]{}|;':,./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Initialize the floating symbols
    const initParticles = () => {
      particles = [];
      // Adjust particle count based on screen size so it isn't too crowded
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 12000); 
      
      for (let i = 0; i < numParticles; i++) {
        const length = Math.floor(Math.random() * 4) + 1; // Strings of 1 to 4 chars
        let str = "";
        for (let j = 0; j < length; j++) {
          str += chars[Math.floor(Math.random() * chars.length)];
        }

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5, // Random X velocity
          vy: (Math.random() - 0.5) * 1.5, // Random Y velocity
          text: str,
          size: Math.floor(Math.random() * 14) + 8, // Font size 8px to 22px
          opacity: Math.random() * 0.15 + 0.02, // Very subtle opacity
          length: length
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); // Re-initialize particles to fill new dimensions
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // Clear the canvas every frame for smooth movement
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Screen Wrap-around (Endless loop)
        if (p.x > canvas.width + 50) p.x = -50;
        else if (p.x < -50) p.x = canvas.width + 50;
        
        if (p.y > canvas.height + 50) p.y = -50;
        else if (p.y < -50) p.y = canvas.height + 50;

        // Randomly scramble the text to keep the "glitch" feel alive
        if (Math.random() > 0.95) {
          let str = "";
          for (let j = 0; j < p.length; j++) {
            str += chars[Math.floor(Math.random() * chars.length)];
          }
          p.text = str;
        }

        // Draw the moving text
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.font = `${p.size}px monospace`;
        ctx.fillText(p.text, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none mix-blend-overlay"
      style={{ opacity: 0.8 }}
    />
  );
}

function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black text-white font-tronica relative">
      <SmoothScroll />
      <Scanlines />
      {/* Global Background Glitch Injected Here */}
      <GlobalGlitchBackground />

      {/* --- GLOBAL STICKY NAVBAR --- */}
      <header className="fixed top-0 inset-x-0 z-50 justify-between flex w-full items-start p-6 text-[11px] uppercase tracking-widest pointer-events-none mix-blend-difference">
        <div className="text-white font-bold pointer-events-auto">
          <img src="/images/logo.png" className="w-[10rem] object-contain" alt="" />
        </div>

        <nav className="flex flex-col gap-1 pointer-events-auto">
          <a href="#works" className="hover:text-white/60 transition w-fit">
            <GlitchText>WORKS</GlitchText>
          </a>
          <a href="#about" className="hover:text-white/60 transition w-fit">
            <GlitchText>ABOUT</GlitchText>
          </a>
        </nav>

        <div className="flex flex-col gap-1 text-white/80 pointer-events-auto">
          <a href="https://github.com/Rylllll" target="__blank" className="w-fit">
            <GlitchText>GITHUB ↗</GlitchText>
          </a>
          <a href="#contact" className="w-fit">
            <GlitchText>reymarkdesigns@gmail.com</GlitchText>
          </a>
        </div>

        <div className="flex flex-col items-end gap-1 text-right pointer-events-auto">
          <span>CREATIVE DEVELOPER</span>
          <span>MANILA, PHILIPPINES</span>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 flex h-screen w-full flex-col justify-between p-6 pt-24 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.18) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(255,255,255,0.18) 0.5px, transparent 0.5px)",
            backgroundSize: "5px 5px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 90%)",
          }}
        />
        <TerminalGlitches />
        <div></div>
        <div className="flex flex-1 items-center justify-center relative z-20">
          <AsciiTitle />
        </div>
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

      {/* ABOUT ME & TECH STACK */}
        <AboutSection />

      {/* SELECTED WORKS */}
      <div id="works" className="relative z-10">
        <WorksGallery 
          works={WORKS} 
          onSelectWork={(work) => navigate(`/work/${work.slug}`)} 
        />
      </div>

      
      {/* CONTACT */}
      <section id="contact" className="relative z-10 border-t border-white/10 px-6 py-32 bg-black">
        <Reveal>
          <div className="mb-8 text-[11px] uppercase tracking-widest text-white/50">
            &gt; ./initiate_contact.sh
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-6xl uppercase leading-[1.05] mb-16 font-druk">
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
                  <li><a href="#" className="hover:text-white/60 flex items-center gap-2"><GlitchText>GITHUB ↗</GlitchText></a></li>
                  <li><a href="#" className="hover:text-white/60 flex items-center gap-2"><GlitchText>LINKEDIN ↗</GlitchText></a></li>
                  <li><a href="#" className="hover:text-white/60 flex items-center gap-2"><GlitchText>TWITTER ↗</GlitchText></a></li>
                </ul>
              </div>
              <div>
                <div className="text-white/50 mb-4 border-b border-white/20 pb-2 w-fit">LOCATION</div>
                <p className="text-white/80 leading-relaxed">MANILA, PHILIPPINES<br />UTC+8 / REMOTE</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-6 pt-16 pb-6">
        <div className="flex justify-center">
          <AsciiTitle />
        </div>
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-4 text-[10px] tracking-widest text-white/40 uppercase gap-4">
          <span>&gt; END_OF_TRANSMISSION</span>
          <span>© 2026 ALL RIGHTS RESERVED</span>
          <a href="#" className="hover:text-white"><GlitchText>↑ BACK_TO_TOP</GlitchText></a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/work/:slug" element={<WorkOverview />} />
      </Routes>
    </Router>
  );
}

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