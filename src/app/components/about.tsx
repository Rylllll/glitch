import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
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

// Map your data items to official SimpleIcons slugs
const TECH_IMAGES = [
  "react", "nextdotjs", "typescript", "tailwindcss", "framer",
  "threedotjs", "webgl", "greensock", "html5", "opengl",
  "nodedotjs", "postgresql", "supabase", "graphql",
  "figma", "adobecreativecloud", "git", "vercel"
];

// Upgraded Reveal
export function Reveal({ children, delay = 0, y = 40 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Line Draw Animation for Dividers
function DrawLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-[1px] w-full bg-white/20 origin-left"
    />
  );
}

// NEW: Snapping + Fast Blink Reveal for Titles
export function SnapTitle({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="overflow-hidden inline-block align-bottom py-1 -my-1">
      <motion.span
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{
          y: "0%",
          opacity: [0, 1, 0, 1, 1], // Rapid blink on reveal
        }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          y: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }, // Hard snap up
          opacity: { duration: 0.4, delay, times: [0, 0.1, 0.2, 0.3, 1] } // Fast sequence
        }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

// Brutalist Table Row (For Professional Log)
function IdentityRow({ col1, col2, col3, delay }: { col1: ReactNode; col2: ReactNode; col3: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} y={20}>
      <motion.div
        initial="initial"
        whileHover="hover"
        className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 py-10 border-b border-white/20 group overflow-hidden cursor-crosshair"
      >
        <motion.div
          variants={{
            initial: { scaleY: 0 },
            hover: { scaleY: 1 }
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-white/[0.03] origin-bottom pointer-events-none"
        />

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 relative z-10 w-full">
          <div className="text-[11px] uppercase tracking-widest text-white/40 group-hover:text-white/70 w-[150px] shrink-0 transition-colors">
            {col1}
          </div>
          
          <motion.div 
            variants={{
              initial: { x: 0 },
              hover: { x: 10 }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-druk text-[24px] md:text-[32px] lg:text-[40px] tracking-wide text-white/90 group-hover:text-white leading-[1] uppercase w-full"
          >
            {col2}
          </motion.div>
        </div>

        <div className="text-[11px] uppercase tracking-widest text-white/50 md:text-right group-hover:text-white/90 relative z-10 shrink-0 mt-4 md:mt-0 transition-colors">
          {col3}
        </div>
      </motion.div>
    </Reveal>
  );
}

// Brutalist Data Module (For Personal Archives)
function ArchiveModule({ title, description, ascii, delay }: { title: string; description: string; ascii: string; delay: number }) {
  return (
    <Reveal delay={delay} y={20}>
      <motion.div 
        initial="initial"
        whileHover="hover"
        className="relative border border-white/20 bg-black p-6 md:p-8 flex flex-col h-full group cursor-crosshair overflow-hidden"
      >
        <motion.div
          variants={{
            initial: { scaleY: 0 },
            hover: { scaleY: 1 }
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-white/[0.03] origin-bottom pointer-events-none"
        />

        {/* HUD Elements */}
        <div className="absolute top-4 right-4 flex gap-1 z-10">
          <div className="w-1.5 h-1.5 bg-white/20 group-hover:bg-white animate-pulse transition-colors"></div>
          <div className="w-1.5 h-1.5 bg-white/20 group-hover:bg-white transition-colors"></div>
        </div>
        <div className="absolute top-4 left-4 text-[9px] text-white/30 tracking-widest group-hover:text-white/60 transition-colors z-10">
          MOD_0{delay * 10}
        </div>

        {/* ASCII Art Display */}
        <div className="flex-1 flex items-center justify-center py-12 relative z-10">
          <pre className="text-[10px] md:text-[12px] text-white/30 font-mono leading-[1.1] group-hover:text-white transition-all duration-500 group-hover:scale-110 transform">
            {ascii}
          </pre>
        </div>

        {/* Footer Info */}
        <div className="border-t border-white/20 pt-6 mt-auto relative z-10">
          <h4 className="font-druk text-[20px] md:text-[24px] uppercase tracking-widest text-white/90 group-hover:text-white leading-none mb-3 transition-colors">
            {title}
          </h4>
          <p className="text-[11px] uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors">
            {description}
          </p>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Smooth Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // Parallax & Marquee Values
  const gridY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const portraitY = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]);
  const logSectionY = useTransform(smoothProgress, [0, 1], ["10%", "-5%"]);
  
  // Tech Stack Opposite Scroll Movement
  const techRow1X = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);
  const techRow2X = useTransform(smoothProgress, [0, 1], ["-30%", "0%"]);

  // Split images into two rows for the marquee
  const halfLength = Math.ceil(TECH_IMAGES.length / 2);
  const topImages = [...TECH_IMAGES.slice(0, halfLength), ...TECH_IMAGES.slice(0, halfLength)];
  const bottomImages = [...TECH_IMAGES.slice(halfLength), ...TECH_IMAGES.slice(halfLength)];

  return (
    <section ref={containerRef} id="about" className="relative z-10 px-6 py-24 bg-[#050505] min-h-screen overflow-hidden">

      {/* HEADER BAR */}
      <Reveal>
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/50 pb-4 relative z-10">
          <span>ABOUT</span>
          <span>IDENTITY // 01</span>
          <span>SYS.QUERY</span>
        </div>
        <DrawLine delay={0.2} />
      </Reveal>

      {/* MASSIVE TYPOGRAPHY HERO (Now with Snapping Reveal) */}
      <div className="py-16 md:py-24 relative z-10 w-full flex flex-col font-druk uppercase leading-[0.85] tracking-tight text-[12vw] md:text-[10vw]">
        <div className="flex justify-between items-start w-full">
          <SnapTitle delay={0.1}>A</SnapTitle>
          <SnapTitle delay={0.3}><span className="text-right">CREATIVE</span></SnapTitle>
        </div>
        <div className="w-full text-center md:text-left mt-2 md:mt-0">
          <SnapTitle delay={0.5}>ENGINEER</SnapTitle>
        </div>
        <div className="w-full text-right mt-2 md:mt-0 text-white/80">
          <SnapTitle delay={0.7}>ARCHITECT</SnapTitle>
        </div>
      </div>

      <div className="w-full relative z-10 mb-16 lg:mb-24">
        <DrawLine />
      </div>

      {/* MASSIVE ASCII GRID & SPLIT BIO STATEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-12 lg:gap-8 items-center relative z-10 mb-32 w-full">
        
        {/* Left: Bold Statement */}
        <div className="flex flex-col justify-center order-2 lg:order-1 ">
          <h3 className="text-3xl md:text-4xl xl:text-5xl uppercase font-druk tracking-wide leading-[1.1] text-white/90">
            <SnapTitle delay={0.4}>I DESIGN.</SnapTitle> <br className="hidden lg:block"/>
            <SnapTitle delay={0.5}>I CODE.</SnapTitle> <br className="hidden lg:block"/>
            <SnapTitle delay={0.6}>I DEPLOY.</SnapTitle>
          </h3>
          <Reveal delay={0.8}>
            <p className="mt-6 text-[11px] leading-relaxed text-white/60 uppercase tracking-widest border-l border-white/20 pl-4">
              Web platforms & digital experiences made from passion. Working at the intersection of logic and aesthetics.
            </p>
          </Reveal>
        </div>

        {/* Middle: MASSIVE ASCII Portrait */}
        <div className="w-full flex justify-center opacity-80 mix-blend-screen overflow-visible order-1 lg:order-2">
          <motion.div style={{ y: portraitY }} className="w-full max-w-full lg:scale-125 xl:scale-150 transform origin-center">
            <Reveal delay={0.4}>
              <AsciiPortrait />
            </Reveal>
          </motion.div>
        </div>

        {/* Right: Description & Download */}
        <div className="flex flex-col justify-center items-start lg:items-end text-left lg:text-right order-3">
          <Reveal delay={0.7}>
            <p className="text-[12px] xl:text-[13px] leading-relaxed text-white/50 uppercase tracking-widest max-w-[280px]">
              Lead Front End Engineer specializing in high-performance, user-centered platforms and interactive 3D experiences.
            </p>
          </Reveal>

          <Reveal delay={0.9} y={10}>
            <a
              href="/Reymark-Boquiron.pdf"
              download="Reymark_Boquiron_Resume.pdf"
              className="inline-flex items-center justify-between gap-4 px-6 py-4 mt-12 border border-white/20 hover:bg-white text-white hover:text-black transition-all duration-300 text-[11px] uppercase tracking-widest font-bold w-full max-w-[240px] group"
            >
              <span>Download Resume</span>
              <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
            </a>
          </Reveal>
        </div>
      </div>

      {/* STRUCTURED DATA TABLE (Professional Experience) */}
      <motion.div style={{ y: logSectionY }} className="relative z-10 w-full mt-24">
        <Reveal delay={0.2}>
          <div className="text-[16px] md:text-[24px] font-druk uppercase tracking-widest text-white/50 pb-2 mb-4">
            // PROFESSIONAL_LOG
          </div>
        </Reveal>

        <div className="w-full">
          <DrawLine delay={0.3} />
          <IdentityRow
            col1="NOV 2023 - PRES"
            col2="LEAD FRONT END ENGINEER"
            col3="YAMAHA MOTOR PHILIPPINES INC."
            delay={0.3}
          />
          <IdentityRow
            col1="FEB - APR 2023"
            col2="FULL STACK WEB DEV INTERN"
            col3="CHANZ IT BUSINESS SOLUTIONS"
            delay={0.4}
          />
          <IdentityRow
            col1="FREELANCE"
            col2="CREATIVE DEVELOPER"
            col3="GLOBAL / REMOTE"
            delay={0.5}
          />
          <IdentityRow
            col1="JAN - OCT 2023"
            col2="EMBEDDED SYSTEMS & WEB"
            col3="RIZAL TECHNOLOGICAL UNIVERSITY"
            delay={0.6}
          />
        </div>
      </motion.div>

      {/* GRID LAYOUT (Personal Archives) */}
      <motion.div style={{ y: logSectionY }} className="relative z-10 w-full mt-32">
        <Reveal delay={0.2}>
          <div className="text-[16px] md:text-[24px] font-druk uppercase tracking-widest text-white/50 pb-2 mb-4">
            // PERSONAL_ARCHIVES
          </div>
        </Reveal>

        <div className="w-full mb-8">
          <DrawLine delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ArchiveModule
            title="FELINE_AFFINITY"
            description="I LOVE CATS."
            ascii={ASCII_CAT}
            delay={0.4}
          />
          <ArchiveModule
            title="LIT_CONSUMPTION"
            description="READING BOOKS."
            ascii={ASCII_BOOK}
            delay={0.5}
          />
          <ArchiveModule
            title="DIGITAL_ESCAPISM"
            description="PLAYING GAMES (TFT, MLBB, ROBLOX)."
            ascii={ASCII_GAME}
            delay={0.6}
          />
        </div>
      </motion.div>

      {/* SCROLL-DRIVEN TECH STACK MARQUEE */}
      <div className="mt-40 relative z-20 pb-24 overflow-hidden">
        <Reveal>
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/50 pb-4 mb-12">
            <span className="font-druk text-[16px] md:text-[24px]">TECH_STACK</span>
            <span>IMG_RENDER_ONLY</span>
          </div>
          <DrawLine delay={0.1} />
        </Reveal>

        <div className="mt-20 flex flex-col gap-12 w-[200vw] -ml-[50vw]">
          {/* Top Marquee: Scrolls Left */}
          <motion.div 
            style={{ x: techRow1X }} 
            className="flex items-center gap-16 md:gap-24 opacity-80"
          >
            {topImages.map((iconSlug, i) => (
              <div key={`top-${iconSlug}-${i}`} className="w-16 h-16 md:w-24 md:h-24 group shrink-0">
                <img
                  src={`https://cdn.simpleicons.org/${iconSlug}/white`}
                  alt={`${iconSlug} icon`}
                  className="w-full h-full object-contain opacity-30 hover:opacity-100 hover:scale-110 transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                />
              </div>
            ))}
          </motion.div>

          {/* Bottom Marquee: Scrolls Right */}
          <motion.div 
            style={{ x: techRow2X }} 
            className="flex items-center gap-16 md:gap-24 opacity-80"
          >
            {bottomImages.map((iconSlug, i) => (
              <div key={`bottom-${iconSlug}-${i}`} className="w-16 h-16 md:w-24 md:h-24 group shrink-0">
                <img
                  src={`https://cdn.simpleicons.org/${iconSlug}/white`}
                  alt={`${iconSlug} icon`}
                  className="w-full h-full object-contain opacity-30 hover:opacity-100 hover:scale-110 transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}