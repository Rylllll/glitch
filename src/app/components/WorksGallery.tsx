import { 
  motion, 
  useScroll, 
  useMotionValueEvent, 
  useMotionValue, 
  useMotionTemplate,
  useTransform
} from "motion/react";
import { useRef, useState, useEffect } from "react";

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

export function WorksGallery({ works, onSelectWork }: { works: any[], onSelectWork: (work: any) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- SCROLL LOGIC FOR DESKTOP ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [displayIndex, setDisplayIndex] = useState(0); 
  const wipeProgress = useMotionValue(0);

  // --- CANVAS ASCII BAND ---
  const renderCanvas = (fraction: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Don't render canvas on mobile (hidden elements return 0 offsetWidth)
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
    
    let disp = Math.floor(exactIndex);
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

  // Intro Cover Mask (Desktop Wipe)
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
      {/* MOBILE GRID LAYOUT (Visible only < 768px)                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="md:hidden flex flex-col gap-6 px-4 py-20 w-full bg-black relative z-10 font-tronica text-white">
        
        <div className="flex items-center justify-between text-[10px] text-white/50 tracking-widest uppercase mb-4 border-b border-white/20 pb-4">
          <span>◉ SELECTED WORKS</span>
          <span>// {String(works.length).padStart(2, "0")}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {works.map((work, index) => (
            <motion.div
              key={work.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col gap-4"
              onClick={() => onSelectWork(work)}
            >
              <div className="w-full aspect-[4/3] overflow-hidden bg-[#111] relative border border-white/10">
                <img 
                  src={work.image} 
                  alt={work.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 text-[9px] text-white/80 tracking-widest backdrop-blur-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                {/* Hover overlay for tapping hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white border border-white/30 px-4 py-2 text-[10px] uppercase tracking-widest backdrop-blur-md">
                    View Project
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-druk text-xl md:text-2xl uppercase tracking-wider text-white">
                  {work.title}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[9px] text-white/50 tracking-widest uppercase border-t border-white/10 pt-2">
                  <div className="flex flex-col">
                    <span className="text-white/30 mb-0.5">CLIENT</span>
                    <span className="text-white/80">{work.client}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-white/30 mb-0.5">DATE</span>
                    <span className="text-white/80">{work.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* ---------------------------------------------------------------- */}
      {/* DESKTOP STICKY SCROLL LAYOUT (Visible only >= 768px)               */}
      {/* ---------------------------------------------------------------- */}
      <div
        ref={containerRef}
        // Hidden on mobile prevents this giant container from ruining the mobile scroll height
        className="hidden md:block relative w-full bg-black font-tronica text-white"
        style={{ height: `${(works.length + 1) * 200}vh` }}
      >
        <div className="hidden">
          {works.map((w) => (
            <img key={`preload-${w.image}`} src={w.image} alt="preload" />
          ))}
        </div>

        <div 
          className="sticky top-0 h-screen w-full overflow-hidden cursor-pointer"
          onClick={() => onSelectWork(displayWork)}
        >
          
          {/* --- INTRO COVER LAYER --- */}
          <motion.div 
            className="absolute inset-0 z-40 bg-[#050505] flex items-center justify-center pointer-events-none"
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
              className="font-druk text-[5vw] uppercase text-white/20 tracking-tighter whitespace-nowrap"
            >
               Projects
            </motion.div>
          </motion.div>

          {/* --- BASE IMAGE LAYERS --- */}
          <div className="absolute inset-0 z-0 bg-black">
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
                <motion.img 
                  key={`base-${i}`}
                  src={w.image} 
                  alt={w.title} 
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ 
                    zIndex: works.length - i, 
                    WebkitMaskImage: mask, 
                    maskImage: mask 
                  }}
                />
              );
            })}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
          </div>

          {/* ASCII Canvas Band Layer */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-20 mix-blend-normal"
            style={{ width: '100%', height: '100%' }}
          />

          {/* MIDDLE ROW (UI) */}
          <div className="absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-6 text-[11px] uppercase tracking-widest text-white/80 pointer-events-none">
            <span>◉ SELECTED WORKS</span>
            <span className="text-white/60 absolute left-1/2 -translate-x-1/2 w-8 text-center">
              <TypewriterText text={`/${String(displayIndex + 1).padStart(2, "0")}`} />
            </span>
            <span>/ {String(works.length).padStart(2, "0")}</span>
          </div>

          {/* BOTTOM ROW (UI) */}
          <div className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-2 items-end gap-6 p-8 pointer-events-none">
            <motion.h2
              key={`title-${displayIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="uppercase leading-[0.9] text-7xl tracking-tight pointer-events-auto"
            >
              <span className="font-druk text-[2rem] font-bold">
                <TypewriterText text={displayWork.title} speed={40} />
              </span>
            </motion.h2>

            <motion.div
              key={`info-${displayIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-3 gap-4 text-[11px] uppercase tracking-widest"
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