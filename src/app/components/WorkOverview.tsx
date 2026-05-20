import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { GlitchText } from "./glitch-text";
import { WORK_PROJECTS, PERSONAL_PROJECTS, TECH_STACK } from "../../data/data";

const SPHERE_POSITIONS = [
  { rotY: 0, rotX: 0 },
  { rotY: 55, rotX: 15 },
  { rotY: -65, rotX: -20 },
  { rotY: 135, rotX: 10 },
  { rotY: -140, rotX: 25 },
  { rotY: 90, rotX: -30 },
  { rotY: -90, rotX: 30 },
];

const ALL_WORKS = [...WORK_PROJECTS, ...PERSONAL_PROJECTS];

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
          for (let j = 0; j < scrambleLength; j++) {
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
      {displayed !== text && <span className="opacity-70 text-white animate-pulse">_</span>}
    </span>
  );
}

export function WorkOverview() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const [hoveredImage, setHoveredImage] = useState<{ src: string, id: number } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredWorkSlug, setHoveredWorkSlug] = useState<string | null>(null);

  const work = ALL_WORKS.find((w) => w.slug === slug);

  const activeHoverIndex = ALL_WORKS.findIndex((w) => w.slug === hoveredWorkSlug);
  const mapOffset = activeHoverIndex !== -1 
    ? SPHERE_POSITIONS[activeHoverIndex % SPHERE_POSITIONS.length] 
    : { rotY: 0, rotX: 0 };

  if (!work) {
    return (
      <div className="h-screen w-full bg-black text-white flex items-center justify-center font-tronica text-sm uppercase tracking-widest">
        PROJECT NOT FOUND. <button onClick={() => navigate('/')} className="ml-4 underline">RETURN HOME ↲</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden font-tronica text-white">
      
      {/* 1. THUMBNAIL FULLSCREEN HOVER OVERLAY */}
      <AnimatePresence>
        {hoveredImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setHoveredImage(null)} 
            className="fixed inset-0 z-[120] pointer-events-auto md:pointer-events-none bg-black/90 flex flex-col items-center justify-center cursor-pointer md:cursor-auto"
          >
            <div className="relative max-w-[90vw] max-h-[80vh]">
              <div className="absolute -top-8 left-0 text-white/50 text-[10px] md:text-xs tracking-widest">
                FRAME / 0{hoveredImage.id}
              </div>
              <img
                src={hoveredImage.src}
                alt="Fullscreen Hover Overlay"
                className="w-full h-full object-contain opacity-100"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SPHERICAL 3D DIRECTORY OVERLAY */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-[#050505] overflow-hidden pointer-events-none flex items-center justify-center"
            style={{ perspective: "1200px" }} 
          >
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            
            <motion.div
              className="absolute w-full h-full flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ 
                rotateX: mapOffset.rotX ? -mapOffset.rotX : 0, 
                rotateY: mapOffset.rotY ? -mapOffset.rotY : 0,
                z: window.innerWidth < 768 ? -500 : -900 
              }}
              transition={{ type: "spring", damping: 28, stiffness: 60 }}
            >
              {ALL_WORKS.map((w, index) => {
                const pos = SPHERE_POSITIONS[index % SPHERE_POSITIONS.length];
                const isFocused = hoveredWorkSlug === w.slug;
                const sphereRadius = window.innerWidth < 768 ? 500 : 900;
                
                return (
                  <div
                    key={w.slug}
                    className="absolute flex flex-col items-center justify-center"
                    style={{ 
                      transform: `rotateY(${pos.rotY}deg) rotateX(${pos.rotX}deg) translateZ(${sphereRadius}px)`,
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <motion.div
                      animate={{ opacity: isFocused ? 1 : 0.3 }}
                      className="absolute -top-6 left-0 text-[10px] md:text-xs text-white/60 tracking-widest"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.div>

                    {/* Desktop Spherical Image */}
                    <motion.img 
                      src={w.image} 
                      alt={w.title} 
                      className="hidden md:block w-[280px] lg:w-[500px] h-auto object-cover shadow-2xl" 
                      animate={{ 
                        scale: isFocused ? 1 : 0.6,
                        opacity: isFocused ? 1 : 0.2,
                        filter: isFocused ? 'grayscale(0%)' : 'grayscale(100%) blur(5px)'
                      }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Mobile Spherical Image */}
                    <motion.img 
                      src={w.mobileImage || w.image} 
                      alt={w.title} 
                      className="block md:hidden w-[60vw] h-auto object-cover shadow-2xl" 
                      animate={{ 
                        scale: isFocused ? 1 : 0.6,
                        opacity: isFocused ? 1 : 0.2,
                        filter: isFocused ? 'grayscale(0%)' : 'grayscale(100%) blur(5px)'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-12 md:-bottom-16 text-[8px] md:text-xs tracking-widest uppercase bg-black/60 px-4 py-2 border border-white/20 backdrop-blur-sm whitespace-nowrap"
                        style={{ transform: "translateZ(50px)" }}
                      >
                        {w.title}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ROOT LEVEL HEADER & DROPDOWN --- */}
      <header className="flex justify-between items-center p-4 md:p-6 text-[9px] md:text-[10px] lg:text-xs uppercase tracking-widest border-b border-white/10 fixed top-0 w-full z-[100] pointer-events-none mix-blend-difference bg-black/20 backdrop-blur-sm md:backdrop-blur-none md:bg-transparent">
        
        {/* CLICK/HOVER TRIGGER */}
        <div 
          className="flex gap-2 items-center pointer-events-auto cursor-pointer"
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
            setHoveredWorkSlug(isDropdownOpen ? null : (slug || null));
          }}
          onMouseEnter={() => {
            if(window.innerWidth >= 768) {
              setIsDropdownOpen(true);
              setHoveredWorkSlug(slug || null);
            }
          }}
          onMouseLeave={() => {
            if(window.innerWidth >= 768) {
              setIsDropdownOpen(false);
              setHoveredWorkSlug(null);
            }
          }}
        >
          <span className="text-white/60">WORKS /</span>
          <span className="bg-white text-black px-1 py-0.5">
            <TypewriterText text={work.title} speed={20} />
          </span>
          <span className=" text-white ml-1">▼</span>
        </div>

        {/* WORK TITLE (Center) */}
        <div className="absolute left-1/2 -translate-x-1/2 text-white/80 hidden md:block mt-1">
          <TypewriterText text={`REYMARK.DEV: ${work.title}`} delay={200} speed={20} />
        </div>
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => navigate('/')}
          className="hover:text-white/60 transition-colors flex text-sm items-center gap-1 pointer-events-auto cursor-pointer mt-1"
        >
          <GlitchText>close</GlitchText>
          <span className="text-[12px] md:text-[14px]">↲</span>
        </button>
      </header>

      {/* ROOT LEVEL DROPDOWN LIST */}
      <div 
        className="fixed top-[48px] md:top-[52px] left-4 md:left-10 z-[100] uppercase tracking-widest pointer-events-auto"
        onMouseEnter={() => {
          if(window.innerWidth >= 768) {
            setIsDropdownOpen(true);
            setHoveredWorkSlug(slug || null);
          }
        }}
        onMouseLeave={() => {
          if(window.innerWidth >= 768) {
            setIsDropdownOpen(false);
            setHoveredWorkSlug(null);
          }
        }}
      >
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col overflow-hidden pl-2 md:pl-[55px] pt-2 drop-shadow-lg bg-black/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-none p-4 md:p-0 rounded-md md:rounded-none" 
            >
              {ALL_WORKS.map((w) => (
                <span 
                  key={w.slug}
                  onMouseEnter={() => setHoveredWorkSlug(w.slug)} 
                  onClick={() => {
                    navigate(`/work/${w.slug}`);
                    setIsDropdownOpen(false);
                  }}
                  className={`text-[9px] md:text-[10px] py-2 md:py-1.5 transition-colors cursor-pointer hover:text-white ${
                    w.slug === slug ? 'text-white font-bold bg-white/20 md:bg-white/10 px-2 md:px-1' : 'text-white/50'
                  }`}
                >
                  {w.title}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- PAGE CONTENT --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10"
      >
        {/* FULLSCREEN HERO IMAGE */}
        <div className="w-full h-[60vh] md:h-screen relative bg-[#111] flex items-center justify-center mt-12 md:mt-0">
          
          {/* Desktop Hero Image */}
          <img
            src={work.image}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 hidden md:block"
          />

          {/* Mobile Hero Image */}
          <img
            src={work.mobileImage || work.image}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 block md:hidden"
          />
          
          {/* CONDITIONALLY RENDER VISIT BUTTON */}
          {work.slug !== "pokedex-cms" && work.slug !== "yamaha-motors-cms" && (
            <a 
              href={work.link}
              target="_blank" 
              rel="noreferrer"
              className="relative z-20 border border-white/30 bg-black/40 backdrop-blur-md px-6 py-3 md:px-8 md:py-4 text-[9px] md:text-[10px] uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto"
            >
              <GlitchText>VISIT LIVE PROJECT ↗</GlitchText>
            </a>
          )}

          <div className="absolute bottom-0 inset-x-0 h-24 md:h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          <div className="absolute top-0 inset-x-0 h-24 md:h-32 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
        </div>

        {/* TWO-COLUMN DETAILS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 p-6 md:p-12 pb-24 max-w-[1800px] mx-auto bg-black relative z-10">

          {/* LEFT COLUMN: Description */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl lg:text-[2rem] font-black uppercase tracking-tighter mb-6 md:mb-8 leading-none font-druk break-words">
              <TypewriterText text={work.title} delay={300} speed={40} />
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 mb-6 md:mb-8 border-b border-white/10 pb-6">
              <div>TYPE <span className="text-white ml-2"><TypewriterText text={work.type || 'COMMERCIAL'} delay={500} /></span></div>
              <div>DATE <span className="text-white ml-2"><TypewriterText text={work.date || '2025'} delay={600} /></span></div>
            </div>

            <div className="text-[10px] md:text-[11px] leading-loose text-white/80 space-y-6 mb-12 lg:mb-16 max-w-lg uppercase tracking-wider">
              <p>{work.description}</p>
            </div>

            <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 space-y-3 mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="shrink-0">TECH STACK:</span>
                <span className="text-white/70">{work.techStack?.join(" // ")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="shrink-0">CLIENT:</span>
                <span className="text-white/70">{work.client}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Gallery & Navigation */}
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl lg:text-xl font-black uppercase tracking-tighter mb-6 md:mb-8 font-druk break-words">
              <TypewriterText text={`REYMARK.DEV: ${work.title}`} delay={400} speed={30} />
            </h2>

            {/* Gallery Grid (Responsive Columns) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 mb-12 md:mb-16">
              {work.images?.map((imgUrl, index) => {
                const num = index + 1;
                return (
                  <div
                    key={num}
                    className="flex flex-col gap-2 group cursor-pointer relative"
                    onClick={() => setHoveredImage({ src: imgUrl, id: num })}
                    onMouseEnter={() => { if(window.innerWidth >= 768) setHoveredImage({ src: imgUrl, id: num }) }}
                    onMouseLeave={() => { if(window.innerWidth >= 768) setHoveredImage(null) }}
                  >
                    <div className="aspect-square bg-[#111] overflow-hidden relative z-20">
                      <img
                        src={imgUrl}
                        className="w-full h-full object-cover transition-all duration-300 md:group-hover:scale-110"
                        alt={`Frame ${num}`}
                      />
                    </div>
                    <span className="text-[8px] md:text-[9px] text-white/40">0{num}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto w-full pt-8 md:pt-12 relative z-20">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-[#1A1A1A] hover:bg-[#2A59E8] transition-colors py-4 text-[9px] md:text-[10px] uppercase tracking-widest text-white/70 hover:text-white cursor-pointer"
              >
                <GlitchText>:/ BACK TO DIRECTORY</GlitchText>
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
