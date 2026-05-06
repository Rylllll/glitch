import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

interface AsciiScrollTransitionProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  index: number;
}

export function AsciiScrollTransition({ targetRef, index }: AsciiScrollTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Skip transition for the very first item
  if (index === 0) {
    return null;
  }

  // 1. Updated Offset
  // "start start" = Animation begins when the section hits the top of the screen (and pins)
  // "end end" = Animation finishes when you have scrolled through the extra height
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"], 
  });

  const renderCanvas = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

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
        const threshold = (noise * 0.2) + (diagonalSweep * 0.8);

        // Map the progress directly to the pinned scrolling phase
        const adjustedProgress = Math.min(1, progress * 1.15);

        if (adjustedProgress < threshold) {
          // Solid black block to hide the image
          ctx.fillStyle = "#050505";
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);

          // ASCII characters on the edges
          if (noise > 0.3) {
            ctx.fillStyle = noise > 0.85 ? "#E87C1E" : "rgba(255, 255, 255, 0.4)";
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
    renderCanvas(latest);
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

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20"
      style={{ width: '100%', height: '100%' }}
    />
  );
}