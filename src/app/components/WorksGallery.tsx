"use client";

import { 
  motion, 
  useScroll, 
  useMotionValueEvent, 
  useMotionValue, 
  useMotionTemplate,
  useTransform,
  useSpring
} from "motion/react";
import { useRef, useState, useEffect, Fragment } from "react";

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

export function WorksGallery({ 
  works, 
  onSelectWork,
  introText = "Projects" 
}: { 
  works: any[], 
  onSelectWork: (work: any) => void,
  introText?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- SCROLL LOGIC FOR ALL DEVICES ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [displayIndex, setDisplayIndex] = useState(0); 
  const [isIntroActive, setIsIntroActive] = useState(true);
  const wipeProgress = useMotionValue(0);

  // --- CUSTOM CURSOR LOGIC ---
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);
  const [isHoveringGallery, setIsHoveringGallery] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  // --- CANVAS ASCII BAND ---
  const renderCanvas = (fraction: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.offsetWidth === 0) return; 

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    if (fraction <= 0 || fraction >= 1) return;

    const blockSize = 14; 
    const cols = Math.ceil(width / blockSize);
    const rows = Math.ceil(height / blockSize);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/<>?";

    const sweepPosition = (fraction * 2) - 0.5;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const noise = Math.abs((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1);
        const normX = x / cols;
        const normY = y / rows;
        const slantedSweep = (normX * 0.05) + (normY * 0.95);
        const distance = slantedSweep - sweepPosition;
        const edge = distance + (noise * 0.6 - 0.3);

        if (edge > -0.18 && edge < 0.18) {
          ctx.fillStyle = "#050505";
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);

          if (noise > 0.2) {
            ctx.fillStyle = noise > 0.8 ? "#ffffff" : "rgba(255, 255, 255, 0.4)";
            ctx.font = `bold ${blockSize - 2}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const charIndex = Math.floor(noise * chars.length);
            ctx.fillText(
              chars[charIndex], 
              x * blockSize + (blockSize / 2), 
              y * blockSize + (blockSize / 2)
            );
          }
        }
      }
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const exactIndex = latest * works.length;
    
    setIsIntroActive(exactIndex < 0.15);

    // Subtracting 0.55 delays the index update until the visual wipe is halfway done.
    let disp = Math.floor(exactIndex - 0.55);
    
    if (disp >= works.length) disp = works.length - 1;
    if (disp < 0) disp = 0;
    
    if (disp !== displayIndex) setDisplayIndex(disp);

    const rawFraction = exactIndex % 1; 
    const delayThreshold = 0.10; 
    
    const fraction = Math.max(0, (rawFraction - delayThreshold) / (1 - delayThreshold));

    if (latest >= 0.999 || fraction === 0) {
      wipeProgress.set(latest >= 0.999 ? 1 : 0);
      renderCanvas(latest >= 0.999 ? 1 : 0);
    } else {
      wipeProgress.set(fraction);
      renderCanvas(fraction);
    }
  });

  useEffect(() => {
    const handleResize = () => renderCanvas(wipeProgress.get());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayWork = works[displayIndex]; 

  // Intro Cover Mask (Wipe)
  const coverWipe = useTransform(scrollYProgress, (latest) => {
    const exact = latest * works.length;
    if (exact >= 1) return 1;
    if (exact <= 0.1) return 0;
    return (exact - 0.1) / 0.9;
  });
  const coverMask = useMotionTemplate`linear-gradient(175deg, transparent calc(${coverWipe} * 200% - 100%), black calc(${coverWipe} * 200%))`;

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* MODERN CUSTOM CURSOR (Visible on Desktop)                          */}
      {/* ---------------------------------------------------------------- */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-[9999] hidden md:flex"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isHoveringGallery ? 1 : 0, 
          scale: isHoveringGallery ? 1 : 0.5 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-[84px] h-[84px] rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl flex items-center justify-center text-white transition-all duration-300">
          <motion.span 
            key={isIntroActive ? "scroll" : "view"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] tracking-[0.2em] uppercase ml-0.5"
          >
            {isIntroActive ? "SCROLL" : "VIEW"}
          </motion.span>
        </div>
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/* FULLSCREEN STICKY SCROLL LAYOUT (All Devices)                      */}
      {/* ---------------------------------------------------------------- */}
      <div
        ref={containerRef}
        className="relative w-full bg-black font-tronica text-white"
        style={{ height: `${(works.length + 1) * 200}vh` }}
      >
        <div className="hidden">
          {works.map((w) => (
            <Fragment key={`preload-${w.slug}`}>
              <img src={w.image} alt="preload desktop" />
              {w.mobileImage && <img src={w.mobileImage} alt="preload mobile" />}
            </Fragment>
          ))}
        </div>

        <div 
          className="sticky top-0 h-screen w-full overflow-hidden md:cursor-none"
          onClick={() => {
            // Guard click event if intro is still active
            if (!isIntroActive) onSelectWork(displayWork);
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringGallery(true)}
          onMouseLeave={() => setIsHoveringGallery(false)}
        >
          
          {/* --- INTRO COVER LAYER --- */}
          <motion.div 
            className="absolute inset-0 z-40 bg-[#050505] flex items-center justify-center pointer-events-none px-4"
            style={{ 
              WebkitMaskImage: coverMask, 
              maskImage: coverMask 
            }}
          >
            <motion.div 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ 
                opacity: [0, 1, 0.1, 1, 0.4, 1],
                x: [-20, 15, -15, 5, -5, 0],
                skewX: [20, -20, 10, -10, 5, 0],
                filter: ["blur(10px)", "blur(0px)", "blur(4px)", "blur(0px)"]
              }}
              transition={{ duration: 0.5, ease: "circOut" }}
              viewport={{ once: true, margin: "-15%" }}
              className="font-druk text-[12vw] sm:text-[10vw] md:text-[5vw] uppercase text-white/20 tracking-tighter whitespace-normal md:whitespace-nowrap text-center leading-none"
            >
               {introText}
            </motion.div>
          </motion.div>

          {/* --- BASE IMAGE LAYERS --- */}
          <div className="absolute inset-0 z-0 bg-black pointer-events-none">
            {works.map((w, i) => {
              const imgWipe = useTransform(scrollYProgress, (latest) => {
                const exact = latest * works.length;
                const shiftI = i + 1; 
                if (exact >= shiftI + 1) return 1; 
                if (exact <= shiftI + 0.1) return 0; 
                return (exact - (shiftI + 0.1)) / 0.9; 
              });

              const mask = useMotionTemplate`linear-gradient(175deg, transparent calc(${imgWipe} * 200% - 100%), black calc(${imgWipe} * 200%))`;

              return (
                <div key={`base-${i}`} className="absolute inset-0 h-full w-full" style={{ zIndex: works.length - i }}>
                  {/* DESKTOP IMAGE */}
                  <motion.img 
                    src={w.image} 
                    alt={w.title} 
                    className="absolute inset-0 h-full w-full object-cover hidden md:block"
                    style={{ 
                      WebkitMaskImage: mask, 
                      maskImage: mask 
                    }}
                  />
                  {/* MOBILE IMAGE */}
                  <motion.img 
                    src={w.mobileImage || w.image} 
                    alt={w.title} 
                    className="absolute inset-0 h-full w-full object-cover block md:hidden"
                    style={{ 
                      WebkitMaskImage: mask, 
                      maskImage: mask 
                    }}
                  />
                </div>
              );
            })}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
          </div>

          {/* ASCII Canvas Band Layer */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-20 mix-blend-normal"
            style={{ width: '100%', height: '100%' }}
          />

          {/* MIDDLE ROW (UI) */}
          <div className="absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-4 md:px-6 text-[9px] md:text-[11px] uppercase tracking-widest text-white/80 pointer-events-none">
            <span>◉ {introText}</span>
            <span className="text-white/60 absolute left-1/2 -translate-x-1/2 w-8 text-center">
              <TypewriterText text={`/${String(displayIndex + 1).padStart(2, "0")}`} />
            </span>
            <span>/ {String(works.length).padStart(2, "0")}</span>
          </div>

          {/* BOTTOM ROW (UI) */}
          <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col md:grid md:grid-cols-2 items-start md:items-end gap-4 md:gap-6 p-6 md:p-8 pointer-events-none">
            <motion.h2
              key={`title-${displayIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="uppercase leading-[0.9] tracking-tight pointer-events-auto max-w-full overflow-hidden"
            >
              <span className="font-druk text-3xl sm:text-4xl md:text-3xl font-bold break-words">
                <TypewriterText text={displayWork.title} speed={40} />
              </span>
            </motion.h2>

            <motion.div
              key={`info-${displayIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-3 gap-2 md:gap-4 text-[9px] md:text-[11px] uppercase tracking-widest pointer-events-none w-full md:w-auto"
            >
              <div>
                <div className="text-white/40 mb-1">CLIENTS</div>
                <div><TypewriterText text={displayWork.client} delay={150} speed={25} /></div>
              </div>
              <div>
                <div className="text-white/40 mb-1">TYPE</div>
                <div><TypewriterText text={displayWork.type} delay={300} speed={25} /></div>
              </div>
              <div>
                <div className="text-white/40 mb-1">DATE</div>
                <div><TypewriterText text={displayWork.date} delay={450} speed={25} /></div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </>
  );
}