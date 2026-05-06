import { 
  motion, 
  useScroll, 
  useMotionValueEvent, 
  useMotionValue, 
  useSpring, 
  useMotionTemplate 
} from "motion/react";
import { useRef, useState, useEffect } from "react";
import { GlitchText } from "./glitch-text"; // Adjust path if needed

export function WorksGallery({ works }: { works: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- 1. MOUSE TRACKING FOR DISTORTION ---
  const mouseX = useMotionValue(-1000); // Start off-screen
  const mouseY = useMotionValue(-1000);
  const maskOpacity = useMotionValue(0);

  // Smooth springs for liquid cursor movement
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  const smoothOpacity = useSpring(maskOpacity, { damping: 20, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Get mouse position relative to the sticky container
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // --- 2. SCROLL ANIMATION LOGIC ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const renderCanvas = (latest: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    if (latest <= 0 || latest >= 1) return;

    const totalTransitions = works.length - 1;
    const exactIndex = latest * totalTransitions;
    
    const fraction = exactIndex % 1;
    const isBuildingUp = fraction < 0.5;
    const sweepProgress = isBuildingUp ? fraction * 2 : (fraction - 0.5) * 2;

    const blockSize = 10; 
    const cols = Math.ceil(width / blockSize);
    const rows = Math.ceil(height / blockSize);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/<>?";

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const noise = Math.abs((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1);
        
        const normX = x / cols;
        const normY = y / rows;
        const diagonalSweep = (normX + normY) / 2;
        const threshold = (diagonalSweep * 0.8) + (noise * 0.2);

        let shouldDraw = false;
        if (isBuildingUp) {
          shouldDraw = sweepProgress > threshold;
        } else {
          shouldDraw = sweepProgress < threshold;
        }

        if (shouldDraw) {
          ctx.fillStyle = "#050505";
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);

          if (noise > 0.4) {
            ctx.fillStyle = noise > 0.85 ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.3)";
            ctx.font = `bold 8px monospace`;
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
    const safeLatest = latest >= 1 ? 0.9999 : latest;
    renderCanvas(safeLatest);
    
    const exactIndex = safeLatest * (works.length - 1);
    const calculatedIndex = Math.round(exactIndex); 
    
    if (calculatedIndex !== currentIndex) {
      setCurrentIndex(calculatedIndex);
    }
  });

  useEffect(() => {
    const handleResize = () => renderCanvas(scrollYProgress.get());
    window.addEventListener("resize", handleResize);
    const timeout = setTimeout(handleResize, 100); 
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const activeWork = works[currentIndex];

  return (
    <div
      ref={containerRef}
      style={{ height: `${works.length * 100}vh` }}
      className="relative w-full bg-black"
    >
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden font-tronica text-white cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => maskOpacity.set(1)}
        onMouseLeave={() => maskOpacity.set(0)}
      >
        
        {/* --- 3. SVG DISTORTION FILTER DEFINITION --- */}
        <svg className="absolute w-0 h-0 hidden">
          <defs>
            <filter id="displacement-filter">
              {/* Generates mathematical noise */}
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
              {/* Uses the noise to push pixels around, creating a warped glass/glitch look */}
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        {/* --- 4. IMAGE LAYERS --- */}
        <div className="absolute inset-0 z-0">
          
          {/* Layer A: Base Image */}
          <img 
            key={`base-${activeWork.image}`}
            src={activeWork.image} 
            alt={activeWork.title} 
            className="h-full w-full object-cover transition-opacity duration-500"
          />

          {/* Layer B: Distorted Overlay (Follows Mouse) */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: smoothOpacity,
              // Creates a soft circle mask that follows the smoothX and smoothY motion values
              WebkitMaskImage: useMotionTemplate`radial-gradient(circle 250px at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`,
              maskImage: useMotionTemplate`radial-gradient(circle 250px at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`,
            }}
          >
            <img 
              key={`distort-${activeWork.image}`}
              src={activeWork.image} 
              alt={activeWork.title} 
              // Scale it up slightly for a magnifying effect and apply the SVG filter
              className="h-full w-full object-cover scale-[1.05]"
              style={{ filter: "url(#displacement-filter) brightness(1.2)" }}
            />
          </motion.div>

          {/* Dark Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>

        {/* ASCII Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-50 mix-blend-normal"
          style={{ width: '100%', height: '100%' }}
        />

        {/* TOP BAR */}
        <div className="absolute inset-x-0 top-0 z-30 grid grid-cols-4 items-start p-6 text-[11px] uppercase tracking-widest pointer-events-none">
          <div className="pointer-events-auto">reymark</div>
          <nav className="flex flex-col gap-1 pointer-events-auto">
            <a href="#works" className="w-fit"><GlitchText>WORKS</GlitchText></a>
            <a href="#about" className="w-fit"><GlitchText>ABOUT</GlitchText></a>
          </nav>
          <div className="flex flex-col gap-1 text-white/80 pointer-events-auto">
            <a href="#" className="w-fit"><GlitchText>INSTAGRAM ↗</GlitchText></a>
            <a href="#contact" className="w-fit"><GlitchText>INFO@REYMARK.MOV</GlitchText></a>
          </div>
          <div className="flex flex-col items-end gap-1 text-right pointer-events-auto">
            <span>PRODUCTION STUDIO</span>
            <span>MANILA, PHILIPPINES</span>
          </div>
        </div>

        {/* MIDDLE ROW */}
        <div className="absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-6 text-[11px] uppercase tracking-widest text-white/80 pointer-events-none">
          <span>◉ SELECTED WORKS</span>
          <span className="text-white/60 absolute left-1/2 -translate-x-1/2">
            <GlitchText>{`/${String(currentIndex + 1).padStart(2, "0")}`}</GlitchText>
          </span>
          <span>/ {String(works.length).padStart(2, "0")}</span>
        </div>

        {/* BOTTOM ROW */}
        <div className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-2 items-end gap-6 p-6 md:p-8 pointer-events-none">
          <motion.h2
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="uppercase leading-[0.9] text-5xl md:text-7xl tracking-tight pointer-events-auto"
          >
            <GlitchText trigger="auto">{activeWork.title}</GlitchText>
          </motion.h2>

          <motion.div
            key={`info-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 text-[11px] uppercase tracking-widest"
          >
            <div>
              <div className="text-white/40">CLIENTS</div>
              <div>{activeWork.client}</div>
            </div>
            <div>
              <div className="text-white/40">TYPE</div>
              <div>{activeWork.type}</div>
            </div>
            <div>
              <div className="text-white/40">DATE</div>
              <div>{activeWork.date}</div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}