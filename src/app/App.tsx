import { type ReactNode, useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { GlitchText } from "./components/glitch-text";
import { AsciiTitle } from "./components/ascii-title";
import { Scanlines } from "./components/scanlines";
import { SmoothScroll } from "./components/smooth-scroll";
import { WorksGallery } from "./components/WorksGallery";
import { TerminalGlitches } from "./components/terminal-glitches";
import { WorkOverview } from "./components/WorkOverview";
import { AboutSection } from "./components/about";

// --- IMPORT DATA HERE ---
import { WORK_PROJECTS, PERSONAL_PROJECTS, TECH_STACK } from "../data/data";

// --- CYBERPUNK TYPEWRITER ANIMATION ---
function TypewriterText({ text, delay = 0, speed = 30 }: { text: string, delay?: number, speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    setDisplayed(""); 
    let iteration = 0;
    let timer: number;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/<>?";
    
    const startTyping = () => {
      timer = window.setInterval(() => {
        setDisplayed(() => {
          const lockedCount = Math.floor(iteration / 2); 
          
          if (lockedCount >= text.length) {
            clearInterval(timer);
            return text;
          }

          const lockedPart = text.substring(0, lockedCount);
          const scrambleLength = Math.min(text.length - lockedCount, 6); 
          let scrambledPart = "";
          for(let j = 0; j < scrambleLength; j++) {
             scrambledPart += Math.random() > 0.8 ? " " : chars[Math.floor(Math.random() * chars.length)];
          }

          return lockedPart + scrambledPart;
        });
        iteration++;
      }, speed);
    };

    const timeout = window.setTimeout(startTyping, delay);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [text, delay, speed]);

  return (
    <span>
      {displayed}
      {displayed !== text && <span className="opacity-70 text-[#E87C1E] animate-pulse">_</span>}
    </span>
  );
}

function BootLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Fake terminal boot sequence
  const bootSequence = [
    "KERNEL: Booting system...",
    "NET: Initializing network interfaces",
    "SYS: Mounting virtual filesystems",
    "AUTH: Verifying user credentials",
    "UI: Loading cyberpunk.css",
    "CORE: Decrypting aesthetic payload",
    "SUCCESS: Welcome back, REYMARK."
  ];

  useEffect(() => {
    let currentProgress = 0;
    let logIndex = 0;
    
    // Randomize the loading speed to feel like a real system boot
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(currentProgress);
      
      // Reveal the next log based on progress percentage
      if (logIndex < bootSequence.length && currentProgress > (logIndex * 15)) {
        setLogs(prev => [...prev, bootSequence[logIndex]]);
        logIndex++;
      }

      // Finish loading
      if (currentProgress === 100) {
        clearInterval(interval);
        // Brief pause at 100% before triggering the exit animation
        setTimeout(() => {
          onComplete();
        }, 800); 
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="boot-loader"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05, 
        filter: "blur(10px) brightness(2)",
        transition: { duration: 0.8, ease: "circIn" } 
      }}
      className="fixed inset-0 z-[99999] bg-[#050505] text-white flex flex-col justify-end p-6 md:p-12 font-mono text-[10px] md:text-[12px] uppercase tracking-widest overflow-hidden"
    >
      {/* Background Grid Pattern (Matches your menu overlay) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.18) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(255,255,255,0.18) 0.5px, transparent 0.5px)",
          backgroundSize: "8px 8px",
        }}
      />

      <div className="relative z-10 flex flex-col gap-2 mb-8 text-white/70 h-[150px] justify-end">
        {logs.map((log, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-[#E87C1E]">&gt;</span> {log}
          </motion.div>
        ))}
        {/* Blinking cursor effect at the end of the logs */}
        {progress < 100 && (
          <motion.div 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-3 bg-white/70 mt-1"
          />
        )}
      </div>
      
      <div className="relative z-10 w-full flex flex-col gap-3">
        <div className="flex justify-between text-white/50">
          <span>SYSTEM.INITIALIZE()</span>
          <motion.span 
            className="text-white"
            animate={progress === 100 ? { color: "#E87C1E", textShadow: "0px 0px 8px rgba(232,124,30,0.8)" } : {}}
          >
            {progress}%
          </motion.span>
        </div>
        {/* Brutalist Progress Bar */}
        <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-white"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// --- GLOBAL CANVAS GLITCH (Moving Particles) ---
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

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 12000);

      for (let i = 0; i < numParticles; i++) {
        const length = Math.floor(Math.random() * 4) + 1;
        let str = "";
        for (let j = 0; j < length; j++) {
          str += chars[Math.floor(Math.random() * chars.length)];
        }

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          text: str,
          size: Math.floor(Math.random() * 14) + 8,
          opacity: Math.random() * 0.15 + 0.02,
          length: length
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x > canvas.width + 50) p.x = -50;
        else if (p.x < -50) p.x = canvas.width + 50;

        if (p.y > canvas.height + 50) p.y = -50;
        else if (p.y < -50) p.y = canvas.height + 50;

        if (Math.random() > 0.95) {
          let str = "";
          for (let j = 0; j < p.length; j++) {
            str += chars[Math.floor(Math.random() * chars.length)];
          }
          p.text = str;
        }

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
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(location.hash || "");

  // Update active hash on scroll or manual change
  useEffect(() => {
    setActiveHash(location.hash);
  }, [location]);

  // Helper for smooth scrolling
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setActiveHash(hash);
    setIsMobileMenuOpen(false);

    if (hash === "" || hash === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/");
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Optional: Update URL without jumping
        window.history.pushState(null, "", hash);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-tronica relative">
      <SmoothScroll />
      <Scanlines />
      <GlobalGlitchBackground />

      {/* --- GLOBAL STICKY NAVBAR --- */}
      <header className="fixed top-0 inset-x-0 z-[60] flex flex-wrap justify-between w-full items-start p-4 md:p-6 text-[9px] md:text-[11px] uppercase tracking-widest pointer-events-none mix-blend-difference gap-y-4">

        {/* LOGO & MOBILE TOGGLE */}
        <div className="text-white font-bold pointer-events-auto flex justify-between items-center w-full md:w-auto">
          <a href="#" onClick={(e) => scrollToSection(e, "")}>
            <img src="/images/logo.png" className="w-[8rem] md:w-[10rem] object-contain cursor-pointer" alt="Logo" />
          </a>

          {/* MOBILE MENU BUTTON (Hidden on Desktop) */}
          <button
            className="md:hidden pointer-events-auto bg-[#222222] text-xs hover:bg-[#333333] text-white px-3 py-2 flex items-center gap-2 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? ':/ CLOSE' : ':/ MENU'}
          </button>
        </div>

        {/* DESKTOP NAV (Hidden on Mobile) */}
        <nav className="hidden md:flex flex-col gap-1 pointer-events-auto w-1/2 md:w-auto text-right md:text-left items-start">
          <a
            href="#works"
            onClick={(e) => scrollToSection(e, "#works")}
            className={`transition-all duration-300 w-fit ${activeHash === "#works" ? "bg-white text-black px-1" : "hover:text-white/60"}`}
          >
            <GlitchText>WORKS</GlitchText>
          </a>
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, "#about")}
            className={`transition-all duration-300 w-fit ${activeHash === "#about" ? "bg-white text-black px-1 mt-1" : "hover:text-white/60 mt-1"}`}
          >
            <GlitchText>ABOUT</GlitchText>
          </a>
        </nav>

        <div className="hidden md:flex flex-col gap-1 text-white/80 pointer-events-auto w-1/2 md:w-auto">
          <a href="https://github.com/Rylllll" target="__blank" className="w-fit hover:text-white transition-colors">
            <GlitchText>GITHUB ↗</GlitchText>
          </a>
          <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="w-fit hover:text-white transition-colors">
            <GlitchText>reymarkdesigns@gmail.com</GlitchText>
          </a>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 text-right pointer-events-auto uppercase">
          <span>CREATIVE front end DEVELOPER</span>
          <span>Antipolo, PHILIPPINES</span>
        </div>
      </header>

      {/* --- FULLSCREEN MENU OVERLAY (Mobile Only) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-0 z-[50] bg-[#050505] text-white flex flex-col justify-between p-6 font-sans pointer-events-auto overflow-hidden"
          >
            {/* Themed Grid Background Layer */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 opacity-10"
              style={{
                backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.18) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(255,255,255,0.18) 0.5px, transparent 0.5px)",
                backgroundSize: "8px 8px",
              }}
            />

            {/* Top Spacer for Header */}
            <div className="h-16 w-full relative z-10" />

            {/* Massive Links Container */}
            <div className="relative z-10 flex flex-col flex-1 gap-6 justify-center items-start w-full">
              <a
                href="#"
                onClick={(e) => scrollToSection(e, "")}
                className={`text-[12vw] font-druk leading-[0.85] tracking-tighter uppercase transition-colors w-fit ${activeHash === "" ? "bg-white text-black px-4 py-2" : "hover:text-white/60"}`}
              >
                HOME
              </a>
              <a
                href="#works"
                onClick={(e) => scrollToSection(e, "#works")}
                className={`text-[12vw] font-druk leading-[0.85] tracking-tighter uppercase transition-colors w-fit ${activeHash === "#works" ? "bg-white text-black px-4 py-2" : "hover:text-white/60"}`}
              >
                WORKS
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, "#about")}
                className={`text-[12vw] font-druk leading-[0.85] tracking-tighter uppercase transition-colors w-fit ${activeHash === "#about" ? "bg-white text-black px-4 py-2" : "hover:text-white/60"}`}
              >
                ABOUT
              </a>
            </div>

            {/* Bottom Footer Info */}
            <div className="relative z-10 flex justify-between items-end w-full pb-4 uppercase tracking-widest text-[10px]">
              <div className="flex flex-col gap-1 font-mono">
                <a href="https://instagram.com" target="__blank" className="hover:text-white/60 transition-colors w-fit">
                  INSTAGRAM
                </a>
                <a href="mailto:reymarkdesigns@gmail.com" className="hover:text-white/60 transition-colors w-fit">
                  reymarkdesigns@gmail.com
                </a>
              </div>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className={`font-mono px-4 py-2 transition-colors flex items-center gap-2 ${activeHash === "#contact" ? "bg-white text-black" : "bg-[#222222] hover:bg-[#333333] text-white"}`}
              >
                &gt; CONTACT ME
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative z-10 flex min-h-screen w-full flex-col justify-between p-4 md:p-6 pt-24 md:pt-32 overflow-hidden">
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

        <div className="scale-[0.35] sm:scale-50 md:scale-100 origin-center transform-gpu mt-12 md:mt-0 flex flex-1 items-center justify-center relative z-20">
          <AsciiTitle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 text-[10px] md:text-[11px] uppercase tracking-widest relative z-20 pb-8 md:pb-0">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span><TypewriterText text="DIGITAL EXPERIENCES." delay={800} speed={25} /></span>
            <span><TypewriterText text="REIMAGINED." delay={1600} speed={25} /></span>
          </div>
          <div className="text-center md:text-right text-white/80 leading-relaxed max-w-sm mx-auto md:max-w-none md:mx-0">
            <span className="md:block"><TypewriterText text="REYMARK IS A CREATIVE DEVELOPER FUSING HIGH-END" delay={2400} speed={15} /></span>
            <span className="md:block"><TypewriterText text="DESIGN WITH A DRIVE TO EXPLORE THE UNCONVENTIONAL..." delay={3800} speed={15} /></span>
          </div>
        </div>
      </section>

      {/* ABOUT ME & TECH STACK */}
      <AboutSection />

      {/* SELECTED WORKS */}
      <div id="works" className="relative z-10 w-full bg-black">
        {/* Render Work Projects first */}
        <WorksGallery
          works={WORK_PROJECTS}
          introText="Work Projects"
          onSelectWork={(work) => navigate(`/work/${work.slug}`)}
        />
        
        {/* Render Personal Projects second */}
        <WorksGallery
          works={PERSONAL_PROJECTS}
          introText="Personal Projects"
          onSelectWork={(work) => navigate(`/work/${work.slug}`)}
        />
      </div>

      {/* CONTACT */}
      <section id="contact" className="relative z-20 border-t border-white/10 px-4 md:px-6 py-20 md:py-32 bg-black overflow-hidden w-full max-w-[100vw]">
        <Reveal>
          <div className="mb-8 text-[10px] md:text-[11px] uppercase tracking-widest text-white/50 relative z-10">
            &gt; ./initiate_contact.sh
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-6xl uppercase leading-[1.05] mb-12 md:mb-16 font-druk relative z-10">
            let's build <br />
            <span className="text-white/60">something._</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 text-[10px] md:text-[11px] uppercase tracking-widest relative z-10">
            <div>
              <div className="text-white/50 mb-4 border-b border-white/20 pb-2 w-fit">STATUS</div>
              <div className="text-white mb-6 md:mb-8">AVAILABLE FOR FREELANCE & COLLABORATION</div>
              <a href="mailto:reymarkdesigns@gmail.com" className="text-base sm:text-xl md:text-3xl hover:text-white/60 transition-colors block break-all">
                <GlitchText>REYMARKDESIGNS@GMAIL.COM</GlitchText>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="text-white/50 mb-4 border-b border-white/20 pb-2 w-fit">NETWORK</div>
                <ul className="space-y-3">
                  <li><a href="https://github.com/Rylllll" target="__blank" className="hover:text-white/60 flex items-center gap-2"><GlitchText>GITHUB ↗</GlitchText></a></li>
                  <li><a href="https://www.linkedin.com/in/reymarkboquiron/" target="__blank" className="hover:text-white/60 flex items-center gap-2"><GlitchText>LINKEDIN ↗</GlitchText></a></li>
                  <li><a href="https://www.instagram.com/rynathhh/?hl=en" target="__blank" className="hover:text-white/60 flex items-center gap-2"><GlitchText>instagram ↗</GlitchText></a></li>
                </ul>
              </div>
              <div>
                <div className="text-white/50 mb-4 border-b border-white/20 pb-2 w-fit">LOCATION</div>
                <p className="text-white/80 leading-relaxed">ANTIPOLO, PHILIPPINES<br />UTC+8 / REMOTE / HYBRID</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/10 px-4 md:px-6 pt-12 md:pt-16 pb-6 bg-black overflow-hidden w-full max-w-[100vw]">

        <div className="w-full flex justify-center items-center h-[60px] sm:h-[100px] md:h-auto overflow-hidden">
          <div className="scale-[0.35] sm:scale-50 md:scale-100 origin-center transform-gpu">
            <AsciiTitle />
          </div>
        </div>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-4 text-[9px] md:text-[10px] tracking-widest text-white/40 uppercase gap-4 text-center md:text-left relative z-10">
          <span>&gt; END_OF_TRANSMISSION</span>
          <span>© 2026 ALL RIGHTS RESERVED</span>

        </div>
        <a href="#" onClick={(e) => scrollToSection(e, "")} className="items-center py-2 mt-2 flex justify-center w-full hover:bg-[#2A59E8] group hover:text-white">
          <div className="text-sm">↑ BACK_TO_TOP</div>
        </a>

      </footer>
    </div>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isLoaded && <BootLoader onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      {/* Render the actual site only when loading is done */}
      {isLoaded && (
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/work/:slug" element={<WorkOverview />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}