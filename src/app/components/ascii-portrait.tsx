import { useState, useEffect, useRef } from "react";

export function AsciiPortrait() {
  const rawMap = [
                                                                                                     
"                                                   ###                                   ",           
"                                                   #####                                  ",           
"                                                *######****# **                          ",           
"                                        ######################***                        ",           
"                                    ####*########################                        ",           
"                                  *####################################*                 ",           
"                                 ### ###################################                 ",           
"                               ### *###################################                  ",           
"                             #### #######################################                ",           
"                          *#####  #######################################                ",           
"                          ###### ##########################################              ",           
"                           ##### ############################################            ",           
"                           ##### #################  ########### ############             ",           
"                          #######################  *##########   #########               ",           
"                           ####  ########## ##*##**###### *  #****  ######               ",           
"                           ####**########  ##########*     ###############               ",          
"                           ###*#* ######                            #####                ",          
"                          *#*   *# ##*##   ##########      *#######*##*##                ",          
"                          ##     #*##*##     *###*          #####   ###**                ",          
"                          ##     *##**#*                           ####**                ",          
"                          ##*    *#***##     *                 *   ###*##                ",          
"                           ##   *# #####   ##            ##     #* ######                ",          
"                            ##**# ##*##*                           ####                  ",          
"                              ###########                         ##                     ",          
"                                     #####          *######*     *##                     ",          
"                                    #####*##                    ###                      ",          
"                                  #######  ####               ###                        ",          
"                                  ###########*######*     *######*                       ",          
"                                  ################################                       ",          
"                                  ################################                       ",          
"                                 #################################                       ",          
"                              ###################################*                       ",          
"                            *###  ################################*                      ",          
"                         #######   ###################################                   ",          
"                        #########  #####################################                 ",          
"                      *##########   ######################################               ",          
"                     ############*  #######################################              ",          
"                    ##############  *########################################            ",          
"                   ###############  *#########################################           ",          
"                  ################   #########################################           ",          
"                  ################   ##########################################          ",          
"                 #################   ###########################################         ",          
"                 #################   ###########################################         ",          
"                 #################   ############################################        ",          
"                ##################  *############################################        ",          
"                ##################  *############################################        ",          
"                ##################  *############################################        ",          
"                ##################  #############################################        ",          
"                    ##############  ##########################################           ",          
"                            *#####  ###################################                  ",          
"                                                                                         ",         
    ];

  const cols = rawMap[0].length;
  const rows = rawMap.length;
  const [grid, setGrid] = useState<string[][]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const cursorTargetRef = useRef({ x: -999, y: -999, intensity: 0 });
  const cursorCurrentRef = useRef({ x: cols / 2, y: rows / 2, intensity: 0 });

  const baseFrameRef = useRef<Float32Array | null>(null);
  const charGridRef = useRef<string[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(" "))
  );

  const SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/<>?";

  useEffect(() => {
    const base = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        base[y * cols + x] = rawMap[y][x] !== " " ? 1 : 0;
      }
    }
    baseFrameRef.current = base;
  }, []);

  useEffect(() => {
    let raf: number;
    const render = () => {
      if (!baseFrameRef.current) {
        raf = window.setTimeout(render, 30) as unknown as number;
        return;
      }

      cursorCurrentRef.current.intensity += (cursorTargetRef.current.intensity - cursorCurrentRef.current.intensity) * 0.15;
      if (cursorTargetRef.current.x !== -999) {
        cursorCurrentRef.current.x += (cursorTargetRef.current.x - cursorCurrentRef.current.x) * 0.2;
        cursorCurrentRef.current.y += (cursorTargetRef.current.y - cursorCurrentRef.current.y) * 0.2;
      }

      const { x: cx, y: cy, intensity } = cursorCurrentRef.current;
      const next: string[][] = [];
      const prevChars = charGridRef.current;
      const currentBase = baseFrameRef.current;

      for (let y = 0; y < rows; y++) {
        const row: string[] = [];
        for (let x = 0; x < cols; x++) {
          let srcX = x;
          let srcY = y;

          if (intensity > 0.01) {
            const dx = x - cx;
            const dy = (y - cy) * 1.8;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 22; 
            
            if (dist < radius && dist > 0.1) {
              const force = Math.pow((radius - dist) / radius, 1.2);
              const pushStrength = 20 * intensity;
              srcX -= (dx / dist) * force * pushStrength;
              srcY -= (dy / dist) * force * pushStrength / 1.8;
            }
          }

          let v = 0;
          if (srcY >= 0 && srcY < rows && srcX >= 0 && srcX < cols) {
            const clampedX = Math.round(srcX);
            const clampedY = Math.round(srcY);
            v = currentBase[clampedY * cols + clampedX];
          }

          if (v > 0.5) {
            let char = prevChars[y][x];
            if (char === " " || Math.random() < 0.1) {
              char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            }
            prevChars[y][x] = char;
            row.push(Math.random() > 0.05 ? char : " ");
          } else {
            prevChars[y][x] = " ";
            row.push(" ");
          }
        }
        next.push(row);
      }
      setGrid(next);
      raf = window.setTimeout(render, 40) as unknown as number;
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
      className="w-full h-full flex flex-col items-center justify-center cursor-crosshair relative group"
    >
      <div className="absolute inset-0 -inset-x-12 -inset-y-12 z-0"></div>
      
      <pre className="relative z-10 font-mono text-[7px] leading-[7px] md:text-[9px] md:leading-[9px] text-white select-none whitespace-pre text-center tracking-tighter transition-all duration-300 opacity-90 mix-blend-screen">
        {grid.map((row, i) => (
          <div key={i}>{row.join("")}</div>
        ))}
      </pre>
    </div>
  );
}