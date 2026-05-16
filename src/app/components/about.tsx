import { ReactNode, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { AsciiPortrait } from "./ascii-portrait";

// Updated Tech Stack Array with custom URLs for icons missing/failing in Simple Icons
const TECH_IMAGES = [
  // Frontend Development
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "react", name: "React.js" },
  { slug: "vite", name: "Vite React" },
  { slug: "tailwindcss", name: "Tailwind CSS" },
  { slug: "sass", name: "SCSS" },
  { slug: "html5", name: "Vanilla HTML" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "react", name: "React Native" },
  
  // Backend Development
  { slug: "nodedotjs", name: "Node.js" },
  { slug: "express", name: "Express.js" },
  { slug: "laravel", name: "Laravel PHP" },
  
  // Databases & Backend Services
  { slug: "mongodb", name: "MongoDB" },
  { slug: "supabase", name: "Supabase" },
  
  // 3D / Web Graphics
  { slug: "webgl", name: "WebGL" },
  { slug: "threedotjs", name: "Three.js" },
  
  // Motion & Animation
  { slug: "framer", name: "Framer Motion" },
  { slug: "greensock", name: "GSAP" },
  
  // Cloud & DevOps
  { slug: "amazonaws", name: "AWS", customUrl: "https://img.icons8.com/color/100/amazon-web-services.png" },
  
  // AI/ML Platforms & Tools
  { slug: "openai", name: "OpenAI API", customUrl: "https://img.icons8.com/ios-filled/100/ffffff/chatgpt.png" },
  { slug: "huggingface", name: "Hugging Face" },
  { slug: "tensorflow", name: "TensorFlow" },
  { slug: "langchain", name: "LangChain" },
  
  // Programming Languages
  { slug: "typescript", name: "TypeScript" },
  { slug: "php", name: "PHP" },
  
  // Design Tools
  { slug: "figma", name: "Figma" },
  { slug: "adobexd", name: "Adobe XD", customUrl: "https://img.icons8.com/color/100/adobe-xd.png" }
];

// --- OUTSIDE THE SCREEN DATA ---
const OUTSIDE_DATA = [
  {
    id: "01",
    title: "photography",
    details: [
      "↳ I LOVE taking pictures",
      "↳ view different flowers",
      "↳ explore different sceneries",
      "↳ One of my fave hobbies"
    ],
    images: [
      "/images/hobbies/photog/car.jpg",
      "/images/hobbies/photog/bird.jpg",
      "/images/hobbies/photog/house.jpg",
      "/images/hobbies/photog/ride.jpg",
      "/images/hobbies/photog/white.jpg",
      "/images/hobbies/photog/dog.jpg",
    ]
  },
  {
    id: "02",
    title: "hiking",
    details: [
      "↳ I love to Hike",
      "↳ Adrenaline!!!",
      "↳ I feel so alive",
      "↳ The wind is cold"
    ],
    images: [
     "/images/hobbies/hiking/1.jpg",
     "/images/hobbies/hiking/2.jpg",
     "/images/hobbies/hiking/3.jpg",
    ]
  },
  {
    id: "03",
    title: "video games",
    details: [
      "↳ PLAYING GAMES",
      "↳ COMPETITIVE STRATEGY",
      "↳ IMMERSIVE WORLDS",
      "↳ TACTICAL RANKED CLIMBS"
    ],
    images: [
      "/images/hobbies/games/dmc.png",
      "/images/hobbies/games/lol.png",
      "/images/hobbies/games/tft.png",
      "/images/hobbies/games/valorant.png",
      "/images/hobbies/games/ml.png",
    ]
  }
];

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

export function SnapTitle({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="overflow-hidden inline-block align-bottom py-1 -my-1">
      <motion.span
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{
          y: "0%",
          opacity: [0, 1, 0, 1, 1],
        }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          y: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.4, delay, times: [0, 0.1, 0.2, 0.3, 1] }
        }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

// Cinematic Glitch Reveal Animation
export function GlitchTitle({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="inline-block align-bottom py-1 -my-1 overflow-visible">
      <motion.span
        initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
        whileInView={{
          opacity: [0, 1, 0.2, 1, 0.5, 1],
          x: [-30, 20, -15, 10, -5, 0],
          skewX: [30, -30, 15, -15, 5, 0],
          filter: ["blur(10px)", "blur(0px)", "blur(6px)", "blur(0px)", "blur(2px)", "blur(0px)"],
          textShadow: [
            "none",
            "4px 0 0 rgba(255,0,0,0.8), -4px 0 0 rgba(0,255,255,0.8)",
            "none",
            "-3px 0 0 rgba(255,0,0,0.8), 3px 0 0 rgba(0,255,255,0.8)",
            "none",
            "none"
          ]
        }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, delay, ease: "circOut" }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function IdentityRow({ col1, col2, col3, delay }: { col1: ReactNode; col2: ReactNode; col3: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} y={20}>
      <motion.div
        initial="initial"
        whileHover="hover"
        className="relative flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 py-8 md:py-10 border-b border-white/20 group overflow-hidden cursor-pointer"
      >
        <motion.div
          variants={{
            initial: { scaleY: 0 },
            hover: { scaleY: 1 }
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-white/[0.03] origin-bottom pointer-events-none"
        />

        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 relative z-10 w-full">
          <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-white/40 group-hover:text-white/70 w-[150px] shrink-0 transition-colors">
            {col1}
          </div>
          
          <motion.div 
            variants={{
              initial: { x: 0 },
              hover: { x: 10 }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-druk text-[20px] sm:text-[24px] md:text-[32px] lg:text-[40px] tracking-wide text-white/90 group-hover:text-white leading-[1.1] md:leading-[1] uppercase w-full"
          >
            {col2}
          </motion.div>
        </div>

        <div className="text-[10px] md:text-[11px] uppercase tracking-widest text-white/50 text-left md:text-right group-hover:text-white/90 relative z-10 shrink-0 mt-2 md:mt-0 transition-colors">
          {col3}
        </div>
      </motion.div>
    </Reveal>
  );
}

function BlockyGlitchImage({ images, alt }: { images: string[]; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const isHovering = useRef(false);
  
  const pristineCanvas = useRef<HTMLCanvasElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-next interval
  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    
    let animationId: number;
    let isRunning = true; // Flag to prevent memory leaks or dead loops

    const img = new Image();
    img.crossOrigin = "anonymous";

    const draw = () => {
      if (!isRunning || !canvas || !ctx || !containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      let needsPristineUpdate = false;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        needsPristineUpdate = true;
      }

      if (!pristineCanvas.current) {
        pristineCanvas.current = document.createElement("canvas");
        needsPristineUpdate = true;
      }

      const pCanvas = pristineCanvas.current;
      const pCtx = pCanvas.getContext("2d");

      if (needsPristineUpdate && pCtx) {
        pCanvas.width = width;
        pCanvas.height = height;
        
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let drawW = width;
        let drawH = height;
        let drawX = 0;
        let drawY = 0;

        if (imgRatio > canvasRatio) {
          drawW = height * imgRatio;
          drawX = (width - drawW) / 2;
        } else {
          drawH = width / imgRatio;
          drawY = (height - drawH) / 2;
        }
        
        pCtx.clearRect(0, 0, width, height);
        pCtx.drawImage(img, drawX, drawY, drawW, drawH);
      }

      ctx.clearRect(0, 0, width, height);
      if (pCanvas) {
        ctx.drawImage(pCanvas, 0, 0);
      }

      if (isHovering.current && pCanvas) {
        const mx = mouse.current.x;
        const my = mouse.current.y;
        
        const blockSize = 3; 
        const radius = 150; 
        const maxPush = 70; 

        const startX = Math.max(0, mx - radius);
        const startY = Math.max(0, my - radius);
        const endX = Math.min(width, mx + radius);
        const endY = Math.min(height, my + radius);

        for (let y = startY; y < endY; y += blockSize) {
          for (let x = startX; x < endX; x += blockSize) {
            const dx = mx - x;
            const dy = my - y;
            const dist = Math.hypot(dx, dy) || 1; 
            
            if (dist < radius) {
              const force = Math.pow(1 - dist / radius, 1.8); 
              
              let srcX = x + (dx / dist) * force * maxPush;
              let srcY = y + (dy / dist) * force * maxPush;
              
              srcX = Math.floor(srcX / blockSize) * blockSize;
              srcY = Math.floor(srcY / blockSize) * blockSize;

              if (Math.random() > 0.88) {
                srcX += (Math.random() > 0.5 ? 1 : -1) * blockSize;
              }

              ctx.drawImage(
                pCanvas, 
                srcX, srcY, blockSize, blockSize, 
                x, y, blockSize, blockSize
              );
            }
          }
        }
      }
      animationId = requestAnimationFrame(draw);
    };

    // Bind onload FIRST to guarantee it fires even if the image is in browser cache
    img.onload = () => {
      pristineCanvas.current = null;
      if (isRunning) {
        draw();
      }
    };
    
    // Assign src LAST
    img.src = images[currentIndex];
    
    return () => {
      isRunning = false; // Kill the old loop when the index changes
      cancelAnimationFrame(animationId);
    };
  }, [images, currentIndex]);

  return (
    <motion.div 
      ref={containerRef} 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black"
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }
      }}
      onTouchMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect && e.touches[0]) {
          mouse.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
          isHovering.current = true;
        }
      }}
      onTouchEnd={() => (isHovering.current = false)}
      onMouseEnter={() => (isHovering.current = true)}
      onMouseLeave={() => (isHovering.current = false)}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer transition-opacity duration-300" />
      
      {/* Optional: Add a simple progress indicator for the images */}
      <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function OutsideScreenInteractive({ delay = 0 }: { delay?: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeData = OUTSIDE_DATA[activeIndex];

  return (
    <Reveal delay={delay} y={20}>
      <div className="relative w-full mt-8">
        {/* Massive Header embedded in the grid layout */}
        <div className="w-full pt-8 md:pt-12 pb-4 md:pb-6 border-b flex flex-wrap gap-x-2 md:gap-x-4">
          <h2 className="font-druk text-[10vw] md:text-[5.5vw] leading-[0.85] tracking-tighter uppercase text-white font-bold m-0 p-0">
            <GlitchTitle delay={0.1}>OUTSIDE</GlitchTitle>
          </h2>
          <h2 className="font-druk text-[10vw] md:text-[5.5vw] leading-[0.85] tracking-tighter uppercase text-white font-bold m-0 p-0">
            <GlitchTitle delay={0.3}>THE</GlitchTitle>
          </h2>
          <h2 className="font-druk text-[10vw] md:text-[5.5vw] leading-[0.85] tracking-tighter uppercase text-white font-bold m-0 p-0">
            <GlitchTitle delay={0.5}>code .</GlitchTitle>
          </h2>
        </div>

        {/* Split Container */}
        <div className="flex flex-col lg:flex-row w-full h-auto min-h-[400px] md:min-h-[500px] gap-4 mt-4">
          
          {/* Left Column (Menu & Details) */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex flex-col items-start gap-2 md:gap-0">
              {OUTSIDE_DATA.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div 
                    key={item.id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`cursor-pointer w-full font-druk uppercase font-extrabold text-[1.5rem] sm:text-[2rem] md:text-[28px] lg:text-[1.2rem] tracking-wide transition-all ${
                      isActive 
                        ? "bg-white text-black px-3 py-1 md:py-0.5" 
                        : "text-white/40 hover:text-white/70 px-3 py-1 md:py-0.5"
                    }`}
                  >
                    {item.title}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 md:mt-auto pt-4 md:pt-16 flex flex-col gap-2 font-mono text-[9px] md:text-[11px] tracking-widest text-white/70 uppercase font-bold mb-6 lg:mb-0">
              {activeData.details.map((detail, i) => (
                <motion.div 
                  key={`${activeIndex}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  {detail}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column (Dynamic Glitch Image) */}
          <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-auto relative overflow-hidden bg-black border-l border-white/10 mt-4 lg:mt-0">
            <AnimatePresence mode="wait">
              <BlockyGlitchImage key={activeData.id} images={activeData.images} alt={activeData.title} />
            </AnimatePresence>
          </div>

        </div>
      </div>
    </Reveal>
  );
}

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  const portraitY = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]);
  const logSectionY = useTransform(smoothProgress, [0, 1], ["10%", "-5%"]);
  
  // Split the array logic for Infinite Marquee
  const halfLength = Math.ceil(TECH_IMAGES.length / 2);
  const firstHalf = TECH_IMAGES.slice(0, halfLength);
  const secondHalf = TECH_IMAGES.slice(halfLength);
  
  // Duplicate the slices to create a seamless looping effect
  const topImages = [...firstHalf, ...firstHalf];
  const bottomImages = [...secondHalf, ...secondHalf];

  return (
    <section ref={containerRef} id="about" className="relative z-10 px-4 md:px-6 py-16 md:py-24 bg-[#050505] min-h-screen overflow-hidden">

      {/* HEADER BAR */}
      <Reveal>
        <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest text-white/50 pb-4 relative z-10">
          <span>ABOUT</span>
          <span className="hidden sm:inline">IDENTITY // 01</span>
          <span>SYS.QUERY</span>
        </div>
        <DrawLine delay={0.2} />
      </Reveal>

      {/* MASSIVE TYPOGRAPHY HERO */}
      <div className="py-12 md:py-24 relative z-10 w-full flex flex-col font-druk uppercase leading-[0.85] tracking-tight text-[15vw] md:text-[10vw]">
        <div className="flex flex-col md:flex-row justify-between items-start w-full text-[2rem] md:text-[10rem]">
          <SnapTitle delay={0.1}>A</SnapTitle>
          <SnapTitle delay={0.3}><span className="text-left md:text-right">CREATIVE</span></SnapTitle>
        </div>
        <div className="w-full text-left mt-2 md:mt-0 text-[2rem] md:text-[10rem]">
          <SnapTitle delay={0.5}>ENGINEER</SnapTitle>
        </div>
        <div className="w-full text-left md:text-right mt-2 md:mt-0 text-white/80 text-[2rem] md:text-[10rem]">
          <SnapTitle delay={0.7}>ARCHITECT</SnapTitle>
        </div>
      </div>

      <div className="w-full relative z-10 mb-12 lg:mb-24">
        <DrawLine />
      </div>

      {/* MASSIVE ASCII GRID & SPLIT BIO STATEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-12 lg:gap-8 items-center relative z-10 mb-20 md:mb-32 w-full">
        
        {/* Left: Bold Statement */}
        <div className="flex flex-col justify-center order-2 lg:order-1 ">
          <h3 className="text-2xl sm:text-3xl md:text-4xl xl:text-4xl uppercase font-druk tracking-wide leading-[1.1] text-white/90">
            <SnapTitle delay={0.4}>I DESIGN.</SnapTitle> <br className="hidden lg:block"/>
            <SnapTitle delay={0.5}>I CODE.</SnapTitle> <br className="hidden lg:block"/>
            <SnapTitle delay={0.6}>I DEPLOY.</SnapTitle>
          </h3>
          <Reveal delay={0.8}>
            <p className="mt-4 md:mt-6 text-[10px] md:text-[11px] leading-relaxed text-white/60 uppercase tracking-widest border-l border-white/20 pl-4">
              Web platforms & digital experiences made from passion. Working at the intersection of logic and aesthetics.
            </p>
          </Reveal>
        </div>

        {/* Middle: MASSIVE ASCII Portrait */}
        <div className="w-full flex justify-center opacity-80 mix-blend-screen overflow-hidden sm:overflow-visible order-1 lg:order-2">
          {/* Responsive Scaling applied to container */}
          <motion.div style={{ y: portraitY }} className="w-full max-w-full scale-100 sm:scale-75 md:scale-100 lg:scale-125 xl:scale-125 transform origin-center">
            <Reveal delay={0.4}>
              <AsciiPortrait />
            </Reveal>
          </motion.div>
        </div>

        {/* Right: Description & Download */}
        <div className="flex flex-col justify-center items-start lg:items-end text-left lg:text-right order-3">
          <Reveal delay={0.7}>
            <p className="text-[11px] xl:text-[13px] leading-relaxed text-white/50 uppercase tracking-widest max-w-[280px]">
              Lead Front End Engineer specializing in high-performance, user-centered platforms and interactive 3D experiences.
            </p>
          </Reveal>

          <Reveal delay={0.9} y={10}>
            <a
              href="/files/Reymark-Boquiron.pdf"
              download="Reymark_Boquiron_Resume.pdf"
              className="inline-flex items-center justify-between gap-4 px-6 py-4 mt-8 md:mt-12 border border-white/20 hover:bg-white text-white hover:text-black transition-all duration-300 text-[10px] md:text-[11px] uppercase tracking-widest font-bold w-full max-w-[240px] group"
            >
              <span>Download Resume</span>
              <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
            </a>
          </Reveal>
        </div>
      </div>

      {/* STRUCTURED DATA TABLE (Professional Experience) */}
      <motion.div style={{ y: logSectionY }} className="relative z-10 w-full mt-16 md:mt-24">
        <Reveal delay={0.2}>
          <div className="text-[14px] md:text-[24px] font-druk uppercase tracking-widest text-white/50 pb-2 mb-4">
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

      {/* INTERACTIVE LAYOUT */}
      <motion.div style={{ y: logSectionY }} className="relative z-10 w-full mt-20 md:mt-32">
        <OutsideScreenInteractive delay={0.3} />
      </motion.div>

      {/* TECH STACK SECTION */}
      <div className="mt-24 md:mt-40 relative z-20 pb-16 md:pb-24 overflow-hidden">
        <Reveal>
          <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest text-white/50 pb-4 mb-8 md:mb-12">
            <span className="font-druk text-[14px] md:text-[24px]">TECH_STACK</span>
            <span>IMG_RENDER_ONLY</span>
          </div>
          <DrawLine delay={0.1} />
        </Reveal>

        {/* MOBILE GRID VIEW (Hidden on Desktop) */}
        <div className="mt-12 grid md:hidden grid-cols-4 sm:grid-cols-5 gap-y-8 gap-x-4 justify-items-center opacity-80">
          {TECH_IMAGES.map((tech, i) => (
            <Reveal key={`mobile-tech-${tech.slug}-${i}`} delay={i * 0.02} y={10}>
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 flex justify-center items-center">
                  <img
                    src={tech.customUrl || `https://cdn.simpleicons.org/${tech.slug}/white`}
                    alt={`${tech.name} icon`}
                    onError={(e) => {
                      e.currentTarget.onerror = null; // Stops the infinite blinking loop
                      e.currentTarget.src = "https://img.icons8.com/ios-filled/100/ffffff/source-code.png";
                    }}
                    className="w-full h-full object-contain opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-[8px] uppercase tracking-widest text-white/50 text-center">
                  {tech.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* DESKTOP INFINITE MARQUEE (Hidden on Mobile) */}
        {/* Removed 'overflow-hidden' from this wrapper to let tooltips bleed outside naturally */}
        <div className="hidden md:flex mt-20 flex-col gap-12 w-full relative">
          
          {/* Top Marquee */}
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            className="flex items-center gap-24 opacity-80 w-max pr-24"
          >
            {topImages.map((tech, i) => (
              <div key={`top-${tech.slug}-${i}`} className="w-24 h-24 group shrink-0 relative flex justify-center">
                <img
                  src={tech.customUrl || `https://cdn.simpleicons.org/${tech.slug}/white`}
                  alt={`${tech.name} icon`}
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Stops the infinite blinking loop
                    e.currentTarget.src = "https://img.icons8.com/ios-filled/100/ffffff/source-code.png";
                  }}
                  className="w-full h-full object-contain opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                />
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-[10px] uppercase tracking-widest bg-black/80 text-white border border-white/20 px-3 py-1 whitespace-nowrap z-50 backdrop-blur-sm translate-y-2 group-hover:translate-y-0">
                  {tech.name}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom Marquee (Reverse direction) */}
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            className="flex items-center gap-24 opacity-80 w-max pr-24"
          >
            {bottomImages.map((tech, i) => (
              <div key={`bottom-${tech.slug}-${i}`} className="w-24 h-24 group shrink-0 relative flex justify-center">
                <img
                  src={tech.customUrl || `https://cdn.simpleicons.org/${tech.slug}/white`}
                  alt={`${tech.name} icon`}
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Stops the infinite blinking loop
                    e.currentTarget.src = "https://img.icons8.com/ios-filled/100/ffffff/source-code.png";
                  }}
                  className="w-full h-full object-contain opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                />
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-[10px] uppercase tracking-widest bg-black/80 text-white border border-white/20 px-3 py-1 whitespace-nowrap z-50 backdrop-blur-sm translate-y-2 group-hover:translate-y-0">
                  {tech.name}
                </div>
              </div>
            ))}
          </motion.div>
          
        </div>
      </div>

    </section>
  );
}