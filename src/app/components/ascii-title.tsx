import { useEffect, useRef, useState } from "react";

const TEXT_1 = "reymark";
const TEXT_2 = "boquiron";
const SYMBOLS = "0123456789!@#$%^&*+-="; // The symbols that will make up the letters

// The text that corresponds to each frame
const MOTIVATIONS = [
  "INIT: REYMARK.MOV // Pushing the boundaries of visual expression.",
  "SYS.RENDER(BOQUIRON) // Code your dreams into reality. Keep building."
];

export function AsciiTitle() {
  const cols = 150;
  const rows = 24;
  const [grid, setGrid] = useState<string[][]>([]);
  
  // State for the text typing effect and timeline
  const [activeShape, setActiveShape] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Cursor interaction state
  const cursorTargetRef = useRef({ x: -999, y: -999, intensity: 0 });
  const cursorCurrentRef = useRef({ x: cols / 2, y: rows / 2, intensity: 0 });
  
  // Animation state for morphing shapes
  const framesRef = useRef<Float32Array[]>([]);
  const currentBaseRef = useRef<Float32Array | null>(null);
  const shapeIndexRef = useRef(0);

  // State for the "Fall into pieces" physics effect
  const fallTargetRef = useRef(0);
  const fallIntensityRef = useRef(0);

  // MEMORY GRID: Keeps track of characters so they don't change every single frame!
  const charGridRef = useRef<string[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(" "))
  );

  // 1. Handle the Typing Effect
  useEffect(() => {
    const fullText = MOTIVATIONS[activeShape];
    let currentLength = 0;
    setTypedText(""); // Reset text on shape change

    const typingInterval = setInterval(() => {
      currentLength++;
      setTypedText(fullText.slice(0, currentLength));
      if (currentLength >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 40); // Speed of the typing effect

    return () => clearInterval(typingInterval);
  }, [activeShape]);

  // 2. Initialize Canvas and ASCII Frames
  useEffect(() => {
    const initCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d")!;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const frames: Float32Array[] = [];
      const cx = cols / 2;
      const cy = rows / 2;

      const saveFrame = () => {
        const img = ctx.getImageData(0, 0, cols, rows).data;
        const base = new Float32Array(cols * rows);
        for (let i = 0; i < cols * rows; i++) base[i] = img[i * 4] / 255;
        frames.push(base);
      };

      // --- FRAME 0: Text 1 (reymark) ---
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cols, rows);
      ctx.fillStyle = "#fff";
      ctx.font = "900 24px 'Tronica Mono', monospace";
      ctx.fillText(TEXT_1, cx, cy);
      saveFrame();

      // --- FRAME 1: Text 2 (boquiron) ---
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cols, rows);
      ctx.fillStyle = "#fff";
      ctx.font = "900 24px 'Tronica Mono', monospace";
      ctx.fillText(TEXT_2, cx, cy);
      saveFrame();

      framesRef.current = frames;
      currentBaseRef.current = new Float32Array(frames[0]);
    };

    document.fonts.ready.then(() => {
      initCanvas();
      setIsLoaded(true); // Signal that frames are ready to animate
    });
  }, []);

  // 3. Custom Timeline for the "Fall and Backup" Narrative Sequence
  useEffect(() => {
    if (!isLoaded) return;
    let isMounted = true;

    // Helper to control narrative timing
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const runSequence = async () => {
      while (isMounted) {
        // Phase 0: Show "reymark"
        shapeIndexRef.current = 0;
        setActiveShape(0);
        // FIX: Pull the pieces back together for reymark when the loop restarts!
        fallTargetRef.current = 0.0; 
        await sleep(10000); 
        if (!isMounted) break;

        // Phase 0.5: SHATTER AND FALL
        fallTargetRef.current = 1.0;
        await sleep(2000); 
        if (!isMounted) break;

        // Phase 1: BACKUP AND MORPH TO "boquiron"
        shapeIndexRef.current = 1;
        setActiveShape(1);
        fallTargetRef.current = 0.0; 
        await sleep(10000);
        if (!isMounted) break;

        // Phase 1.5: SHATTER AND FALL AGAIN
        fallTargetRef.current = 1.0;
        await sleep(2000); 
        if (!isMounted) break;
      }
    };

    runSequence();

    return () => {
      isMounted = false;
    };
  }, [isLoaded]);

  // 4. Core Render & Physics Loop
  useEffect(() => {
    let raf: number;
    const render = () => {
      if (!currentBaseRef.current || framesRef.current.length === 0) {
        raf = window.setTimeout(render, 30) as unknown as number;
        return;
      }

      // Smoothly morph between frames
      const targetBase = framesRef.current[shapeIndexRef.current];
      const currentBase = currentBaseRef.current;
      for (let i = 0; i < currentBase.length; i++) {
        currentBase[i] += (targetBase[i] - currentBase[i]) * 0.015; 
      }

      // Smoothly interpolate Cursor & Fall physics
      cursorCurrentRef.current.intensity += (cursorTargetRef.current.intensity - cursorCurrentRef.current.intensity) * 0.15;
      if (cursorTargetRef.current.x !== -999) {
        cursorCurrentRef.current.x += (cursorTargetRef.current.x - cursorCurrentRef.current.x) * 0.2;
        cursorCurrentRef.current.y += (cursorTargetRef.current.y - cursorCurrentRef.current.y) * 0.2;
      }
      fallIntensityRef.current += (fallTargetRef.current - fallIntensityRef.current) * 0.02;

      const { x: cx, y: cy, intensity } = cursorCurrentRef.current;
      const fall = fallIntensityRef.current;
      const next: string[][] = [];
      const prevChars = charGridRef.current; // Grab the memory grid
      
      for (let y = 0; y < rows; y++) {
        const row: string[] = [];
        for (let x = 0; x < cols; x++) {
          let srcX = x;
          let srcY = y;

          // PHYSICS: The "Fall Into Pieces" coordinate displacement
          if (fall > 0.001) {
            const colHash = Math.abs(Math.sin(x * 12.9898) * 43758.5453) % 1;
            const rowHash = Math.abs(Math.sin(y * 78.233) * 43758.5453) % 1;
            srcY -= fall * (colHash * 30 + rowHash * 10); 
            srcX += (colHash - 0.5) * fall * 15;
          }

          // PHYSICS: Mouse Cursor Repulsion
          if (intensity > 0.01) {
            const dx = x - cx;
            const dy = (y - cy) * 2.2; 
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 32; 
            
            if (dist < radius && dist > 0.1) {
              const force = Math.pow((radius - dist) / radius, 1.2);
              const pushStrength = 22 * intensity; 
              srcX -= (dx / dist) * force * pushStrength;
              srcY -= (dy / dist) * force * pushStrength / 2.2;
            }
          }

          let v = 0;
          if (srcY >= 0 && srcY < rows && srcX >= 0 && srcX < cols) {
            const clampedX = Math.round(srcX);
            const clampedY = Math.round(srcY);
            v = currentBase[clampedY * cols + clampedX];
          }

          if (v > 0.35) {
            // SLOW DOWN LOGIC: Only change the symbol 5% of the time!
            let char = prevChars[y][x];
            if (char === " " || Math.random() < 0.05) {
              char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            }
            prevChars[y][x] = char; // Save it to memory for the next frame

            row.push(Math.random() > 0.04 ? char : " ");
          } else {
            prevChars[y][x] = " "; // Erase from memory if it's empty
            row.push(" "); 
          }
        }
        next.push(row);
      }
      setGrid(next);
      raf = window.setTimeout(render, 30) as unknown as number; 
    };
    
    render();
    return () => clearTimeout(raf);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    cursorTargetRef.current = { x: px * cols, y: py * rows, intensity: 1 };
  };
  
  const onLeave = () => {
    cursorTargetRef.current.intensity = 0;  
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="w-full flex flex-col items-center justify-center"
    >
      <pre className="font-tronica text-[12px] leading-[11px] md:text-[16px] md:leading-[14px] text-white select-none whitespace-pre text-center tracking-tighter transition-all duration-300">
        {grid.map((row, i) => (
          <div key={i}>{row.join("")}</div>
        ))}
      </pre>

    </div>
  );
}