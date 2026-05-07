import { ReactNode, useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { GlitchText } from "./glitch-text";
import { AsciiPortrait } from "./ascii-portrait";

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

// --- NEW RESUME TECH STACK DATA WITH ICONS ---
const RESUME_TECH_STACK = [
  {
    category: "Frontend Dev",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    ),
    skills: ["React.js", "Next.js", "Vite React", "Tailwind CSS", "SCSS", "Vanilla HTML", "JavaScript"]
  },
  {
    category: "Backend Dev",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
      </svg>
    ),
    skills: ["Node.js", "Laravel PHP"]
  },
  {
    category: "3D / Web Graphics",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    skills: ["WebGL", "Three.js"]
  },
  {
    category: "Motion",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ),
    skills: ["Framer Motion", "GSAP"]
  },
  {
    category: "Languages",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    skills: ["TypeScript", "JavaScript", "PHP"]
  },
  {
    category: "Design Tools",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
      </svg>
    ),
    skills: ["Figma", "Adobe XD"]
  }
];

// --- COMPONENT: SCRAMBLE / DECODE TEXT ---
export function ScrambleText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;
    
    let timeout: ReturnType<typeof setTimeout>;
    let frame: number;
    let iteration = 0;
    const chars = "!<>-_\\/[]{}—=+*^?#_01";

    const animate = () => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        cancelAnimationFrame(frame);
      } else {
        iteration += 1 / 3; 
        frame = requestAnimationFrame(animate);
      }
    };

    timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [isInView, text, delay]);

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="opacity-0">{text}</span>
      <span className="absolute top-0 left-0 w-full h-full text-white/90">{displayText}</span>
    </span>
  );
}

// Upgraded Reveal
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

// HUD Style Personal Info Card
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
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 border border-white/10 bg-black hover:bg-white/[0.02] transition-all duration-500 group cursor-crosshair overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50"></div>
        
        <pre className="text-[10px] md:text-[12px] text-white/30 font-mono leading-[1.1] group-hover:text-white transition-colors duration-500 z-10">
          {asciiArt}
        </pre>
        <div className="flex flex-col z-10">
          <span className="text-white/30 text-[10px] mb-2 uppercase tracking-widest border-b border-white/10 pb-1 w-fit transition-colors group-hover:text-white/60">
            [mod]: {moduleName}
          </span>
          <div className="text-[14px] uppercase tracking-widest font-bold">
            <ScrambleText text={content} delay={delay + 0.2} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="relative z-10 border-t border-white/10 px-6 py-32 bg-[#050505] min-h-screen">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      ></div>

      <Reveal>
        <div className="mb-16 text-[11px] uppercase tracking-widest text-white/50 relative z-10 flex items-center gap-4">
          <span className="inline-block w-2 h-2 bg-white/50 animate-pulse"></span>
          <ScrambleText text="SYS.QUERY // WHOAMI" />
        </div>
      </Reveal>
      
      <div className="flex relative z-20 flex-col lg:flex-row items-start gap-16 lg:gap-24">
        
        {/* Left Column: Sticky ASCII Portrait */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-32 relative group flex justify-center pb-12 lg:pb-0">
          <Reveal delay={0.1}>
            <div className="w-full max-w-[500px] opacity-70 hover:opacity-100 transition-opacity duration-700 mix-blend-screen">
              <AsciiPortrait />
            </div>
          </Reveal>
        </div>

        {/* Right Column: Bio & Data */}
        <div className="flex flex-col flex-1 w-full lg:w-[60%]">
          
          <h2 className="text-3xl uppercase leading-[1.05] md:text-5xl font-druk tracking-tight flex flex-col">
            <ScrambleText text="i design. i code. i deploy." delay={0.1} />
            <span className="text-white/40 mt-2 text-2xl md:text-3xl">
              <ScrambleText text="building interfaces made from passion._" delay={0.5} />
            </span>
          </h2>

          <Reveal delay={0.6}>
            <div className="mt-12 text-[13px] leading-relaxed text-white/60 uppercase tracking-widest space-y-6 max-w-2xl border-l-2 border-white/10 pl-6 relative">
              <div className="absolute -left-[5px] top-0 w-2 h-2 bg-white/20"></div>
              <p>
                <ScrambleText text="Lead Front End Engineer and digital architect specializing in high-performance, user-centered web platforms and interactive 3D experiences." delay={0.7} />
              </p>
              <p>
                <ScrambleText text="My work lives at the intersection of logic and aesthetics. I design and implement scalable front-end solutions that improve site performance and user engagement, utilizing tools like React, Next.js, Three.js, and Laravel alongside strong UI/UX foundations in Figma." delay={1.2} />
              </p>
            </div>
          </Reveal>

          {/* Download Resume Button */}
          <Reveal delay={1.8} y={15}>
            <a 
              href="/Reymark-Boquiron.pdf" 
              download="Reymark_Boquiron_Resume.pdf"
              className="inline-flex items-center gap-3 px-8 py-4 mt-8 border border-white/30 bg-black hover:bg-white text-white hover:text-black transition-all duration-300 text-[11px] uppercase tracking-widest group cursor-crosshair w-fit font-bold relative overflow-hidden"
            >
              <span className="relative z-10">&gt; EXTRACT_DATA [RESUME.PDF]</span>
              <span className="relative z-10 group-hover:translate-y-1 transition-transform duration-300">↓</span>
            </a>
          </Reveal>

          {/* Component-Based Personal Info Cards */}
          <div className="mt-24 space-y-4 max-w-2xl">
            <Reveal delay={0.2}>
              <div className="text-[11px] uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 w-fit mb-8 flex items-center gap-2">
                <span className="text-white/30">#</span>
                <ScrambleText text="MOUNT /DEV/PERSONAL_ARCHIVES" delay={0.3} />
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

          {/* EXPERIENCE (HUD Timeline Layout) */}
          <div className="mt-32 max-w-2xl relative">
            <Reveal delay={0.2}>
              <div className="mb-12 text-[11px] uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 w-fit flex items-center gap-2">
                <span className="text-white/30">#</span>
                <ScrambleText text="EXEC ./EXPERIENCE.LOG" delay={0.3} />
              </div>
            </Reveal>
            
            {/* Timeline Track */}
            <div className="absolute left-[5px] md:left-[140px] top-[80px] bottom-0 w-[1px] bg-white/10 hidden md:block"></div>

            <div className="space-y-16 text-[11px] uppercase tracking-widest">
              {/* Yamaha */}
              <Reveal delay={0.4} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start relative">
                  <span className="text-white/40 group-hover:text-white transition-colors duration-300 md:mt-1 bg-black pr-4 z-10 w-fit">
                    <ScrambleText text="NOV 2023 - PRES" delay={0.5} />
                  </span>
                  
                  <div className="hidden md:block absolute left-[138px] top-[6px] w-[5px] h-[5px] bg-white/30 group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 z-10"></div>

                  <div className="pl-4 md:pl-0 border-l border-white/10 md:border-none">
                    <div className="text-white font-bold text-[13px] tracking-widest"><ScrambleText text="LEAD FRONT END ENGINEER" delay={0.6} /></div>
                    <div className="text-white/40 mt-1 mb-6"><ScrambleText text="YAMAHA MOTOR PHILIPPINES INC." delay={0.7} /></div>
                    <ul className="space-y-3 text-white/60 normal-case tracking-normal text-[12px] leading-relaxed">
                      <li><span className="text-white/30 mr-2 opacity-50">[+]</span> <ScrambleText text="Led the front-end architecture and full revamp of the corporate web ecosystem, achieving 90% faster performance." delay={0.8} /></li>
                      <li><span className="text-white/30 mr-2 opacity-50">[+]</span> <ScrambleText text="Designed a scalable component library and design system using React, TypeScript, and Tailwind CSS." delay={1.0} /></li>
                      <li><span className="text-white/30 mr-2 opacity-50">[+]</span> <ScrambleText text="Built key platforms including the Yamaha Racing website and the YClub community platform." delay={1.2} /></li>
                    </ul>
                  </div>
                </div>
              </Reveal>

              {/* Chanz IT */}
              <Reveal delay={0.5} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start relative">
                  <span className="text-white/40 group-hover:text-white transition-colors duration-300 md:mt-1 bg-black pr-4 z-10 w-fit">
                    <ScrambleText text="FEB - APR 2023" delay={0.6} />
                  </span>
                  
                  <div className="hidden md:block absolute left-[138px] top-[6px] w-[5px] h-[5px] bg-white/20 group-hover:bg-white transition-all duration-300 z-10"></div>

                  <div className="pl-4 md:pl-0 border-l border-white/10 md:border-none">
                    <div className="text-white font-bold text-[13px] tracking-widest"><ScrambleText text="FULL STACK WEB DEV INTERN" delay={0.7} /></div>
                    <div className="text-white/40 mt-1 mb-6"><ScrambleText text="CHANZ IT BUSINESS SOLUTIONS INC." delay={0.8} /></div>
                    <ul className="space-y-3 text-white/60 normal-case tracking-normal text-[12px] leading-relaxed">
                      <li><span className="text-white/30 mr-2 opacity-50">[+]</span> <ScrambleText text="Designed and developed a responsive number-to-words converter with Peso-USD currency conversion." delay={0.9} /></li>
                      <li><span className="text-white/30 mr-2 opacity-50">[+]</span> <ScrambleText text="Implemented a professional gallery website showcasing global tourist destinations with optimized assets." delay={1.1} /></li>
                    </ul>
                  </div>
                </div>
              </Reveal>

              {/* Freelance */}
              <Reveal delay={0.6} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start relative">
                  <span className="text-white/40 group-hover:text-white transition-colors duration-300 md:mt-1 bg-black pr-4 z-10 w-fit">
                    <ScrambleText text="FREELANCE" delay={0.7} />
                  </span>

                  <div className="hidden md:block absolute left-[138px] top-[6px] w-[5px] h-[5px] bg-white/20 group-hover:bg-white transition-all duration-300 z-10"></div>

                  <div className="pl-4 md:pl-0 border-l border-white/10 md:border-none">
                    <div className="text-white font-bold text-[13px] tracking-widest"><ScrambleText text="CREATIVE DEVELOPER" delay={0.8} /></div>
                    <div className="text-white/40 mt-1 mb-6"><ScrambleText text="GLOBAL / REMOTE" delay={0.9} /></div>
                    <ul className="space-y-3 text-white/60 normal-case tracking-normal text-[12px] leading-relaxed">
                      <li><span className="text-white/30 mr-2 opacity-50">[+]</span> <ScrambleText text="Designed responsive websites and portfolios with an emphasis on UX, accessibility, and performance." delay={1.0} /></li>
                      <li><span className="text-white/30 mr-2 opacity-50">[+]</span> <ScrambleText text="Delivered foundational 3D modeling and animation work for client showcases." delay={1.2} /></li>
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* EDUCATION (HUD Timeline Layout) */}
          <div className="mt-24 max-w-2xl relative">
            <Reveal delay={0.2}>
              <div className="mb-12 text-[11px] uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 w-fit flex items-center gap-2">
                <span className="text-white/30">#</span>
                <ScrambleText text="READ ./EDUCATION.LOG" delay={0.3} />
              </div>
            </Reveal>

            <div className="absolute left-[5px] md:left-[140px] top-[80px] bottom-0 w-[1px] bg-white/10 hidden md:block"></div>
            
            <div className="space-y-12 text-[11px] uppercase tracking-widest">
              <Reveal delay={0.4} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start relative">
                  <span className="text-white/40 group-hover:text-white transition-colors duration-300 md:mt-1 bg-black pr-4 z-10 w-fit">
                    <ScrambleText text="JAN - OCT 2023" delay={0.5} />
                  </span>

                  <div className="hidden md:block absolute left-[138px] top-[6px] w-[5px] h-[5px] bg-white/20 group-hover:bg-white transition-all duration-300 z-10"></div>

                  <div className="pl-4 md:pl-0 border-l border-white/10 md:border-none">
                    <div className="text-white font-bold text-[13px] tracking-widest"><ScrambleText text="RIZAL TECHNOLOGICAL UNIVERSITY" delay={0.6} /></div>
                    <div className="text-white/40 mt-1 mb-4"><ScrambleText text="PASIG CITY" delay={0.7} /></div>
                    <div className="text-white/60 normal-case tracking-normal text-[12px] leading-relaxed">
                      <ScrambleText text="Coursework: Embedded systems, Microprocessors, Web developing." delay={0.8} /> <br/>
                      <span className="text-white/40"><ScrambleText text="Awards: Academic Achiever, Deans Lister." delay={1.0} /></span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.6} y={20}>
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 group items-start relative">
                  <span className="text-white/40 group-hover:text-white transition-colors duration-300 md:mt-1 bg-black pr-4 z-10 w-fit">
                    <ScrambleText text="2017 - 2019" delay={0.7} />
                  </span>

                  <div className="hidden md:block absolute left-[138px] top-[6px] w-[5px] h-[5px] bg-white/20 group-hover:bg-white transition-all duration-300 z-10"></div>

                  <div className="pl-4 md:pl-0 border-l border-white/10 md:border-none">
                    <div className="text-white font-bold text-[13px] tracking-widest"><ScrambleText text="MARIKINA POLYTECHNIC COLLEGE" delay={0.8} /></div>
                    <div className="text-white/40 mt-1 mb-4"><ScrambleText text="MARIKINA CITY" delay={0.9} /></div>
                    <div className="text-white/60 normal-case tracking-normal text-[12px] leading-relaxed">
                      <ScrambleText text="TVL ICT strand focusing on computer software servicing. Completed NC II certification." delay={1.0} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

        </div>
      </div>

      {/* MODERN BENTO-BOX TECH STACK */}
      <div className="mt-40 relative z-20">
        <Reveal>
          <div className="mb-12 text-[11px] uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 w-fit flex items-center gap-2">
            <span className="text-white/30">#</span>
            <ScrambleText text="SCAN ./TECH_STACK_MODULES" delay={0.2} />
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESUME_TECH_STACK.map((group, i) => (
            <Reveal key={group.category} delay={i * 0.15} y={30}>
              <div className="p-6 border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/30 transition-all duration-500 h-full flex flex-col relative overflow-hidden group">
                
                {/* Decorative Top-Right Corner */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-white/40 transition-colors duration-500"></div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/5 rounded-sm group-hover:bg-white/10 transition-colors text-white/70 group-hover:text-white">
                    {group.icon}
                  </div>
                  <h3 className="text-[13px] font-bold uppercase tracking-widest text-white/80 group-hover:text-white">
                    <ScrambleText text={group.category} delay={0.3 + (i * 0.1)} />
                  </h3>
                </div>

                {/* Badges/Pills Layout */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {group.skills.map((skill, j) => (
                    <motion.span 
                      key={skill} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + (i * 0.1) + (j * 0.05) }}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-white/10 bg-black text-white/60 group-hover:border-white/40 group-hover:text-white transition-all cursor-crosshair flex items-center gap-2"
                    >
                      <span className="text-white/30">&gt;</span> <ScrambleText text={skill} delay={0.5 + (j * 0.05)} />
                    </motion.span>
                  ))}
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}