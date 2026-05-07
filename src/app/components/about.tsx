import { ReactNode, useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { GlitchText } from "./glitch-text";
import { AsciiPortrait } from "./ascii-portrait";
import { TECH_STACK } from "../../data/data";

// --- ASCII ART ASSETS ---
const ASCII_CAT = `
   |\\__/,|   (\`\\
 _.|o o  |_   ) )
-(((---(((--------
`;

const ASCII_BOOK = `
  ______ ______
 _/      Y      \\_
// ~~ ~~ | ~~ ~  \\\\
// ~ ~ ~~ | ~~~ ~~ \\\\
//________.|.________\\\\
\`----------\`-'----------'
`;

const ASCII_GAME = `
  .-----------.
 /  __     __  \\
|  |__|   |__|  |
|               |
 \\  [+]   (A)  /
  '-----------'
`;

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#_";

// --- NEW: SCRAMBLE TEXT REVEAL COMPONENT ---
export function ScrambleText({ children, delay = 0, speed = 0.5 }: { children: string, delay?: number, speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      setIsVisible(true);
      let iteration = 0;
      const targetText = children;
      
      const interval = setInterval(() => {
        setText(
          targetText.split("").map((char, index) => {
            if (index < iteration) return targetText[index];
            if (char === " ") return " ";
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }).join("")
        );

        if (iteration >= targetText.length) {
          clearInterval(interval);
        }
        iteration += speed;
      }, 30);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, children, delay, speed]);

  return (
    <span ref={ref} className={isVisible ? "opacity-100" : "opacity-0"}>
      {text || children}
    </span>
  );
}

// Upgraded Reveal with modern easing
export function Reveal({ children, delay = 0, y = 40 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PersonalInfoCard({ 
  moduleName, 
  content, 
  asciiArt, 
  delay 
}: { 
  moduleName: string; 
  content: string; 
  asciiArt: string; 
  delay: number;
}) {
  return (
    <Reveal delay={delay} y={20}>
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white/[0.01] hover:bg-white/[0.04] transition-all duration-500 group cursor-crosshair">
        {/* Decorative Terminal Corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30 group-hover:border-white transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30 group-hover:border-white transition-colors"></div>

        <pre className="text-[10px] md:text-[12px] text-white/30 font-mono leading-[1.1] group-hover:text-white group-hover:animate-pulse transition-colors duration-500">
          {asciiArt}
        </pre>
        <div className="flex flex-col">
          <span className="text-white/30 text-[10px] mb-2 uppercase tracking-widest border-b border-white/10 pb-1 w-fit transition-colors group-hover:text-white/60">
            <ScrambleText delay={delay + 0.1}>module: </ScrambleText>
            <ScrambleText delay={delay + 0.2}>{moduleName}</ScrambleText>
          </span>
          <div className="text-[14px] uppercase tracking-widest text-white/90">
            <ScrambleText delay={delay + 0.3}>{content}</ScrambleText>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="relative z-10 border-t border-white/10 px-6 py-32 bg-[#050505] min-h-screen">
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <Reveal>
        <div className="mb-16 text-[11px] uppercase tracking-widest text-white/50 flex items-center gap-4 relative z-20">
          <span className="w-8 h-[1px] bg-white/30"></span>
          <ScrambleText delay={0.1}>&gt; init_sequence: whoami.sh</ScrambleText>
        </div>
      </Reveal>
      
      <div className="flex relative z-20 flex-col lg:flex-row items-start gap-16 lg:gap-24">
        
        {/* Left Column: Sticky ASCII Portrait */}
        <div className="w-full lg:w-[35%] lg:sticky lg:top-32 relative group flex flex-col items-center justify-center pb-12 lg:pb-0">
          <Reveal delay={0.1}>
            <div className="w-full max-w-[500px] opacity-70 hover:opacity-100 transition-opacity duration-700 relative">
              {/* HUD Elements around Portrait */}
              <div className="absolute -top-4 -left-4 w-4 h-4 border-t border-l border-white/40"></div>
              <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b border-r border-white/40"></div>
              <div className="absolute top-1/2 -right-8 text-[8px] text-white/30 tracking-widest rotate-90 origin-right">
                <ScrambleText delay={0.5}>ID: REYMARK_B // STATUS: ONLINE</ScrambleText>
              </div>
              <AsciiPortrait />
            </div>
          </Reveal>
        </div>

        {/* Right Column: Bio & Data */}
        <div className="flex flex-col flex-1 w-full lg:w-[65%] border-l border-white/5 pl-0 lg:pl-12 relative">
          
          <h2 className="text-3xl uppercase leading-[1.05] md:text-5xl font-druk tracking-tight mb-12">
            <span className="block mb-2 text-white/90">
              <ScrambleText delay={0.2} speed={0.4}>i design. i code. i deploy.</ScrambleText>
            </span>
            <span className="text-white/40 block text-2xl md:text-4xl">
              <ScrambleText delay={0.6} speed={0.4}>building interfaces made from passion._</ScrambleText>
            </span>
          </h2>

          <div className="text-[13px] leading-relaxed text-white/60 uppercase tracking-widest space-y-8 max-w-2xl relative">
            <div className="absolute -left-[53px] top-2 w-[11px] h-[11px] bg-white rounded-full hidden lg:block animate-pulse"></div>
            <p>
              <ScrambleText delay={0.8} speed={1}>
                Lead Front End Engineer and digital architect specializing in high-performance, user-centered web platforms and interactive 3D experiences.
              </ScrambleText>
            </p>
            <p>
              <ScrambleText delay={1.2} speed={1}>
                My work lives at the intersection of logic and aesthetics. I design and implement scalable front-end solutions that improve site performance and user engagement, utilizing tools like React, Next.js, Three.js, and Laravel alongside strong UI/UX foundations in Figma.
              </ScrambleText>
            </p>
          </div>

          {/* Download Resume Button */}
          <Reveal delay={1.5} y={15}>
            <a 
              href="/Reymark-Boquiron.pdf" 
              download="Reymark_Boquiron_Resume.pdf"
              className="relative inline-flex items-center gap-4 px-8 py-4 mt-12 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/60 transition-all duration-300 text-[11px] uppercase tracking-widest group cursor-crosshair w-fit overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10"><ScrambleText delay={1.7}>&gt; DOWNLOAD_RESUME.PDF</ScrambleText></span>
              <span className="relative z-10 group-hover:translate-y-1 transition-transform duration-300 text-white/50 group-hover:text-white">↓</span>
            </a>
          </Reveal>

          {/* Component-Based Personal Info Cards */}
          <div className="mt-28 space-y-4 max-w-2xl">
            <Reveal delay={0.2}>
              <div className="text-[11px] uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 w-fit mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-white/30 rounded-full"></span>
                <ScrambleText delay={0.3}>ls ./personal_archives</ScrambleText>
              </div>
            </Reveal>

            <PersonalInfoCard 
              moduleName="feline_affinity" 
              content="I love cats." 
              asciiArt={ASCII_CAT} 
              delay={0.4} 
            />
            
            <PersonalInfoCard 
              moduleName="literature_consumption" 
              content="Reading books." 
              asciiArt={ASCII_BOOK} 
              delay={0.6} 
            />
            
            <PersonalInfoCard 
              moduleName="digital_escapism" 
              content="Playing games (TFT, MLBB, Roblox)." 
              asciiArt={ASCII_GAME} 
              delay={0.8} 
            />
          </div>

          {/* EXPERIENCE */}
          <div className="mt-32 max-w-2xl relative">
            <div className="absolute -left-[53px] top-0 w-[1px] h-full bg-gradient-to-b from-white/20 to-transparent hidden lg:block"></div>
            
            <Reveal delay={0.2}>
              <div className="mb-12 text-[11px] uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 w-fit flex items-center gap-3">
                 <span className="w-2 h-2 bg-white/30 rounded-full"></span>
                <ScrambleText delay={0.3}>cat ./experience.log</ScrambleText>
              </div>
            </Reveal>
            
            <div className="space-y-16 text-[11px] uppercase tracking-widest">
              {/* Yamaha */}
              <Reveal delay={0.4} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start">
                  <span className="text-white/40 md:mt-1 border-b md:border-none border-white/10 pb-2 md:pb-0">
                    <ScrambleText delay={0.5}>NOV 2023 - PRES</ScrambleText>
                  </span>
                  <div className="relative">
                    <div className="text-white font-bold text-[14px] tracking-widest"><ScrambleText delay={0.6}>LEAD FRONT END ENGINEER</ScrambleText></div>
                    <div className="text-white/40 mt-2 mb-6"><ScrambleText delay={0.7}>YAMAHA MOTOR PHILIPPINES INC. / MANDALUYONG CITY</ScrambleText></div>
                    <ul className="space-y-4 text-white/60 normal-case tracking-normal text-[13px] leading-relaxed">
                      <li className="flex items-start gap-3"><span className="text-white/30 mt-1">&gt;</span> <span><ScrambleText delay={0.8} speed={1.5}>Led the front-end architecture and full revamp of the corporate web ecosystem, achieving 90% faster performance.</ScrambleText></span></li>
                      <li className="flex items-start gap-3"><span className="text-white/30 mt-1">&gt;</span> <span><ScrambleText delay={1.0} speed={1.5}>Designed a scalable component library and design system using React, TypeScript, and Tailwind CSS.</ScrambleText></span></li>
                      <li className="flex items-start gap-3"><span className="text-white/30 mt-1">&gt;</span> <span><ScrambleText delay={1.2} speed={1.5}>Built key platforms including the Yamaha Racing website and the YClub community platform.</ScrambleText></span></li>
                    </ul>
                  </div>
                </div>
              </Reveal>

              {/* Chanz IT */}
              <Reveal delay={0.4} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start">
                  <span className="text-white/40 md:mt-1 border-b md:border-none border-white/10 pb-2 md:pb-0">
                    <ScrambleText delay={0.5}>FEB 2023 - APR 2023</ScrambleText>
                  </span>
                  <div className="relative">
                    <div className="text-white font-bold text-[14px] tracking-widest"><ScrambleText delay={0.6}>FULL STACK WEB DEV INTERN</ScrambleText></div>
                    <div className="text-white/40 mt-2 mb-6"><ScrambleText delay={0.7}>CHANZ IT BUSINESS SOLUTIONS INC. / ORTIGAS CITY</ScrambleText></div>
                    <ul className="space-y-4 text-white/60 normal-case tracking-normal text-[13px] leading-relaxed">
                      <li className="flex items-start gap-3"><span className="text-white/30 mt-1">&gt;</span> <span><ScrambleText delay={0.8} speed={1.5}>Designed and developed a responsive number-to-words converter with Peso-USD currency conversion.</ScrambleText></span></li>
                      <li className="flex items-start gap-3"><span className="text-white/30 mt-1">&gt;</span> <span><ScrambleText delay={1.0} speed={1.5}>Implemented a professional gallery website showcasing global tourist destinations with optimized assets.</ScrambleText></span></li>
                    </ul>
                  </div>
                </div>
              </Reveal>

              {/* Freelance */}
              <Reveal delay={0.4} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start">
                  <span className="text-white/40 md:mt-1 border-b md:border-none border-white/10 pb-2 md:pb-0">
                    <ScrambleText delay={0.5}>FREELANCE</ScrambleText>
                  </span>
                  <div className="relative">
                    <div className="text-white font-bold text-[14px] tracking-widest"><ScrambleText delay={0.6}>FREELANCE CREATIVE DEVELOPER</ScrambleText></div>
                    <div className="text-white/40 mt-2 mb-6"><ScrambleText delay={0.7}>GLOBAL / REMOTE</ScrambleText></div>
                    <ul className="space-y-4 text-white/60 normal-case tracking-normal text-[13px] leading-relaxed">
                      <li className="flex items-start gap-3"><span className="text-white/30 mt-1">&gt;</span> <span><ScrambleText delay={0.8} speed={1.5}>Designed responsive websites and portfolios with an emphasis on UX, accessibility, and performance.</ScrambleText></span></li>
                      <li className="flex items-start gap-3"><span className="text-white/30 mt-1">&gt;</span> <span><ScrambleText delay={1.0} speed={1.5}>Delivered foundational 3D modeling and animation work for client showcases.</ScrambleText></span></li>
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* EDUCATION */}
          <div className="mt-32 max-w-2xl relative">
            <Reveal delay={0.2}>
              <div className="mb-12 text-[11px] uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 w-fit flex items-center gap-3">
                 <span className="w-2 h-2 bg-white/30 rounded-full"></span>
                <ScrambleText delay={0.3}>cat ./education.log</ScrambleText>
              </div>
            </Reveal>
            
            <div className="space-y-16 text-[11px] uppercase tracking-widest">
              <Reveal delay={0.4} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start">
                  <span className="text-white/40 md:mt-1 border-b md:border-none border-white/10 pb-2 md:pb-0">
                    <ScrambleText delay={0.5}>JAN 2023 - OCT 2023</ScrambleText>
                  </span>
                  <div className="relative">
                    <div className="text-white font-bold text-[14px] tracking-widest"><ScrambleText delay={0.6}>RIZAL TECHNOLOGICAL UNIVERSITY</ScrambleText></div>
                    <div className="text-white/40 mt-2 mb-4"><ScrambleText delay={0.7}>PASIG CITY</ScrambleText></div>
                    <div className="text-white/60 normal-case tracking-normal text-[13px] leading-relaxed">
                      <ScrambleText delay={0.8} speed={1.5}>Coursework: Embedded systems, Microprocessors, Web developing.</ScrambleText> <br/>
                      <span className="text-white/80"><ScrambleText delay={1.0} speed={1.5}>Awards: Academic Achiever, Deans Lister.</ScrambleText></span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start">
                  <span className="text-white/40 md:mt-1 border-b md:border-none border-white/10 pb-2 md:pb-0">
                    <ScrambleText delay={0.5}>FEB 2017 - SEP 2019</ScrambleText>
                  </span>
                  <div className="relative">
                    <div className="text-white font-bold text-[14px] tracking-widest"><ScrambleText delay={0.6}>MARIKINA POLYTECHNIC COLLEGE</ScrambleText></div>
                    <div className="text-white/40 mt-2 mb-4"><ScrambleText delay={0.7}>MARIKINA CITY</ScrambleText></div>
                    <div className="text-white/60 normal-case tracking-normal text-[13px] leading-relaxed">
                      <ScrambleText delay={0.8} speed={1.5}>TVL ICT strand focusing on computer software servicing. Completed NC II certification.</ScrambleText>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

        </div>
      </div>

      {/* TECH STACK */}
      <div className="mt-40 relative z-20 border-t border-white/10 pt-20">
        <Reveal>
          <div className="mb-16 text-[11px] uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 w-fit mx-auto lg:mx-0 flex items-center gap-3">
             <span className="w-2 h-2 bg-white/30 rounded-full"></span>
            <ScrambleText delay={0.1}>ls ./tech_stack_modules</ScrambleText>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16 text-[11px] uppercase tracking-widest">
          {TECH_STACK.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} y={30}>
              <div className="p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group relative overflow-hidden h-full">
                {/* HUD scanline */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 -translate-y-full group-hover:animate-scanline"></div>
                
                <div className="flex items-center gap-3 mb-8 text-white/50 group-hover:text-white transition-colors duration-500">
                  <span className="opacity-80 group-hover:animate-spin text-xl">{s.icon}</span>
                  <span className="font-bold tracking-[0.2em]">
                    <ScrambleText delay={(i * 0.1) + 0.2}>[{s.code}] {s.label}</ScrambleText>
                  </span>
                </div>
                <ul className="space-y-4 text-white/60 normal-case tracking-normal text-[13px]">
                  {s.items.map((it, j) => (
                    <motion.li 
                      key={it} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.1) + (j * 0.05) + 0.4 }}
                      className="hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-3 cursor-crosshair"
                    >
                      <span className="text-white/20 text-[9px]">&gt;</span>
                      <ScrambleText delay={(i * 0.1) + (j * 0.05) + 0.5}>{it}</ScrambleText>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}