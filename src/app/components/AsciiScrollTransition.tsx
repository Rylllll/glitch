import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

interface AsciiScrollTransitionProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function AsciiScrollTransition({ targetRef }: AsciiScrollTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Updated Offset Math
  // "start end" = Animation begins when the TOP of the section hits the BOTTOM of your screen.
  // "start start" = Animation finishes when the TOP of the section hits the TOP of your screen.
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "start start"], 
  });

  const renderCanvas = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 2. Use exact container size instead of window size for perfect fit
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const blockSize = 20; // Slightly larger chunks
    const cols = Math.ceil(width / blockSize);
    const rows = Math.ceil(height / blockSize);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/<>?";

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Static noise so the blocks don't dance around
        const noise = Math.abs((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1);
        
        // This math makes it "eat" from the bottom to the top as you scroll down
        const threshold = noise * 0.4 + (1 - (y / rows)) * 0.6;

        if (progress < threshold) {
          // Draw the black masking block
          ctx.fillStyle = "#050505";
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);

          // Draw the colored characters
          if (noise > 0.3) {
            ctx.fillStyle = noise > 0.85 ? "#E87C1E" : "rgba(255, 255, 255, 0.4)";
            ctx.font = `bold 12px monospace`;
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

  // 3. Listen to the scroll change and update
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 🚨 DEBUGGING: Check your browser console!
    console.log("Scroll Progress:", latest); 
    renderCanvas(latest);
  });

  useEffect(() => {
    // 4. Force a render slightly after mount to ensure DOM sizes are calculated
    const handleResize = () => renderCanvas(scrollYProgress.get());
    window.addEventListener("resize", handleResize);
    
    const timeout = setTimeout(handleResize, 100); 
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20"
      style={{ width: '100%', height: '100%' }} // Forces CSS to stretch it
    />
  );
}