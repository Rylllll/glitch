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
import { AboutSection } from "./components/about"
// --- IMPORT DATA HERE ---
import { WORKS, TECH_STACK } from "../data/data";


function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black text-white font-tronica relative">
      <SmoothScroll />
      <Scanlines />

      {/* --- GLOBAL STICKY NAVBAR --- */}
      <header className="fixed top-0 inset-x-0 z-50 grid grid-cols-4 items-start p-6 text-[11px] uppercase tracking-widest pointer-events-none mix-blend-difference">
        <div className="text-white font-extrabold pointer-events-auto">reymark</div>

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

      {/* SELECTED WORKS */}
      <div id="works" className="relative z-10 border-t border-white/10">
        <WorksGallery 
          works={WORKS} 
          onSelectWork={(work) => navigate(`/work/${work.slug}`)} 
        />
      </div>

      {/* ABOUT ME & TECH STACK */}
        <AboutSection />
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