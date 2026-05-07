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

  // --- SCROLL LOGIC ---
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    if (fraction <= 0 || fraction >= 1) return;

    // 1. Made the box in the transitions bigger
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

        // 2. Made the height of the transition a little bit smaller
        // Reduced from +/- 0.35 to +/- 0.18
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
    const exactIndex = latest * (works.length - 1);
    const disp = Math.round(exactIndex);
    if (disp !== displayIndex) setDisplayIndex(disp);

    const rawFraction = exactIndex % 1; 
    const delayThreshold = 0.20; 
    
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

  return (
    <div
      ref={containerRef}
      style={{ height: `${works.length * 250}vh` }}
      className="relative w-full bg-black"
    >
      <div className="hidden">
        {works.map((w) => (
          <img key={`preload-${w.image}`} src={w.image} alt="preload" />
        ))}
      </div>

      <div 
        // Changed cursor-crosshair to cursor-pointer and added onClick
        className="sticky top-0 h-screen w-full overflow-hidden font-tronica text-white cursor-pointer"
        onClick={() => onSelectWork(displayWork)}
      >
        
        {/* --- BASE IMAGE LAYERS --- */}
        <div className="absolute inset-0 z-0 bg-black">
          {works.map((w, i) => {
            const imgWipe = useTransform(scrollYProgress, (latest) => {
              const exact = latest * (works.length - 1);
              if (exact >= i + 1) return 1; 
              if (exact <= i + 0.2) return 0; 
              return (exact - (i + 0.2)) / 0.8; 
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
          <div className="absolute inset-0 z-50 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
        </div>

        {/* Removed the Distorted Hover Layers entire section */}

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
        <div className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-2 items-end gap-6 p-6 md:p-8 pointer-events-none">
          <motion.h2
            key={`title-${displayIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="uppercase leading-[0.9] text-5xl md:text-7xl tracking-tight pointer-events-auto"
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
  );
}