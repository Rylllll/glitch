import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { GlitchText } from "./glitch-text";
import { WORKS, TECH_STACK } from "../../data/data";

// Upgraded to true 3D Spherical Coordinates (rotateY for longitude, rotateX for latitude)
const SPHERE_POSITIONS = [
  { rotY: 0, rotX: 0 },
  { rotY: 55, rotX: 15 },
  { rotY: -65, rotX: -20 },
  { rotY: 135, rotX: 10 },
  { rotY: -140, rotX: 25 },
  { rotY: 90, rotX: -30 },
  { rotY: -90, rotX: 30 },
];

// --- TYPING & RANDOMIZING SYMBOLS EFFECT ---
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

  // State for the hover fullscreen overlay (Thumbnails) now tracks src AND number
  const [hoveredImage, setHoveredImage] = useState<{ src: string, id: number } | null>(null);
  
  // State for the header dropdown and the spatial map
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredWorkSlug, setHoveredWorkSlug] = useState<string | null>(null);

  // Find the specific work based on the URL slug
  const work = WORKS.find((w) => w.slug === slug);

  // Helper to find the 3D angles for the spatial sphere animation
  const activeHoverIndex = WORKS.findIndex((w) => w.slug === hoveredWorkSlug);
  const mapOffset = activeHoverIndex !== -1 
    ? SPHERE_POSITIONS[activeHoverIndex % SPHERE_POSITIONS.length] 
    : { rotY: 0, rotX: 0 };

  // If someone goes to a URL that doesn't exist, show a simple fallback
  if (!work) {
    return (
      <div className="h-screen w-full bg-black text-white flex items-center justify-center font-tronica text-sm uppercase tracking-widest">
        PROJECT NOT FOUND. <button onClick={() => navigate('/')} className="ml-4 underline">RETURN HOME ↲</button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-tronica text-white">
      
      {/* 1. THUMBNAIL FULLSCREEN HOVER OVERLAY */}
      <AnimatePresence>
        {hoveredImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[120] pointer-events-none bg-black/80 flex flex-col items-center justify-center"
          >
            <div className="relative">
              {/* Number overlay on the thumbnail image */}
              <div className="absolute -top-8 left-0 text-white/50 text-[10px] md:text-xs tracking-widest">
                FRAME / 0{hoveredImage.id}
              </div>
              <img
                src={hoveredImage.src}
                alt="Fullscreen Hover Overlay"
                className="w-96 h-96 object-contain opacity-90"
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
            style={{ perspective: "1200px" }} // Adds 3D depth to the viewport
          >
            {/* CRT Grid Background */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            
            {/* 3D Pivot Container (Rotates the entire sphere) */}
            <motion.div
              className="absolute w-full h-full flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ 
                rotateX: mapOffset.rotX ? -mapOffset.rotX : 0, 
                rotateY: mapOffset.rotY ? -mapOffset.rotY : 0,
                z: -900 // Pushes the pivot back so items ride on the surface of the sphere
              }}
              transition={{ type: "spring", damping: 28, stiffness: 60 }}
            >
              {WORKS.map((w, index) => {
                const pos = SPHERE_POSITIONS[index % SPHERE_POSITIONS.length];
                const isFocused = hoveredWorkSlug === w.slug;
                
                return (
                  <div
                    key={w.slug}
                    className="absolute flex flex-col items-center justify-center"
                    style={{ 
                      // Places the image on the edge of the 900px radius sphere
                      transform: `rotateY(${pos.rotY}deg) rotateX(${pos.rotX}deg) translateZ(900px)`,
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* Floating Number Top Left of Spatial Map Image */}
                    <motion.div
                      animate={{ opacity: isFocused ? 1 : 0.3 }}
                      className="absolute -top-6 left-0 text-[10px] md:text-xs text-white/60 tracking-widest"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.div>

                    <motion.img 
                      src={w.image} 
                      alt={w.title} 
                      className="w-[280px] md:w-[500px] h-auto object-cover shadow-2xl" 
                      animate={{ 
                        scale: isFocused ? 1 : 0.6,
                        opacity: isFocused ? 1 : 0.2,
                        filter: isFocused ? 'grayscale(0%)' : 'grayscale(100%) blur(5px)'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Floating Title for the focused item */}
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-16 text-[10px] md:text-xs tracking-widest uppercase bg-black/60 px-4 py-2 border border-white/20 backdrop-blur-sm"
                        style={{ transform: "translateZ(50px)" }} // Pops the text off the image slightly
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

      {/* --- ROOT LEVEL HEADER & DROPDOWN (100% immune to z-index clipping) --- */}
      <header className="flex justify-between items-start p-6 text-[10px] md:text-xs uppercase tracking-widest border-b border-white/10 fixed top-0 w-full z-[100] pointer-events-none mix-blend-difference">
        
        {/* HOVER TRIGGER */}
        <div 
          className="flex gap-2 items-center pointer-events-auto cursor-pointer"
          onMouseEnter={() => {
            setIsDropdownOpen(true);
            setHoveredWorkSlug(slug || null); 
          }}
          onMouseLeave={() => {
            setIsDropdownOpen(false);
            setHoveredWorkSlug(null);
          }}
        >
          <span className="text-white/60">WORKS /</span>
          <span className="bg-white text-black px-0.5 ">
            <TypewriterText text={work.title} speed={20} />
          </span>
        </div>

        {/* WORK TITLE (Center) */}
        <div className="absolute left-1/2 -translate-x-1/2 text-white/80 hidden md:block mt-1">
          <TypewriterText text={`REYMARK.DEV: ${work.title}`} delay={200} speed={20} />
        </div>
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => navigate('/')}
          className="hover:text-white/60 transition-colors flex items-center gap-1 pointer-events-auto cursor-pointer mt-1"
        >
          <GlitchText>close</GlitchText>
          <span className="text-[14px]">↲</span>
        </button>
      </header>

      {/* ROOT LEVEL DROPDOWN LIST */}
      <div 
        className="fixed top-[52px] left-10 z-[100] uppercase tracking-widest pointer-events-auto"
        onMouseEnter={() => {
          setIsDropdownOpen(true);
          setHoveredWorkSlug(slug || null); 
        }}
        onMouseLeave={() => {
          setIsDropdownOpen(false);
          setHoveredWorkSlug(null);
        }}
      >
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col overflow-hidden pl-[55px] pt-1 drop-shadow-lg" 
            >
              {WORKS.map((w) => (
                <span 
                  key={w.slug}
                  onMouseEnter={() => setHoveredWorkSlug(w.slug)} 
                  onClick={() => {
                    navigate(`/work/${w.slug}`);
                    setIsDropdownOpen(false);
                  }}
                  className={`text-[8px] md:text-[10px] py-1.5 transition-colors cursor-pointer hover:text-white ${
                    w.slug === slug ? 'text-white font-bold bg-white/10 px-1' : 'text-white/50'
                  }`}
                >
                  {w.title}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- PAGE CONTENT (Rendered below overlays) --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10"
      >
        {/* FULLSCREEN HERO IMAGE */}
        <div className="w-full h-screen relative bg-[#111] flex items-center justify-center">
          <img
            src={work.image}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          
          {/* VISIT LINK BUTTON */}
          <a 
            href="#" 
            target="_blank" 
            rel="noreferrer"
            className="relative z-20 border border-white/30 bg-black/40 backdrop-blur-md px-8 py-4 text-[10px] uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto"
          >
            <GlitchText>VISIT LIVE PROJECT ↗</GlitchText>
          </a>

          {/* Simple gradient at the bottom to ensure the transition to the text section is smooth */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>

        {/* TWO-COLUMN DETAILS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 p-8 md:p-12 pb-24 max-w-[1800px] mx-auto bg-black relative z-10">

          {/* LEFT COLUMN: Description */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-[2rem] font-black uppercase tracking-tighter mb-8 leading-none font-druk">
              <TypewriterText text={work.title} delay={300} speed={40} />
            </h1>

            <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest text-white/40 mb-8 border-b border-white/10 pb-6">
              <div>TYPE <span className="text-white ml-2"><TypewriterText text={work.type || 'COMMERCIAL'} delay={500} /></span></div>
              <div>DATE <span className="text-white ml-2"><TypewriterText text={work.date || '2025'} delay={600} /></span></div>
            </div>

            {/* DYNAMIC DESCRIPTION INJECTED HERE */}
            <div className="text-[11px] leading-loose text-white/80 space-y-6 mb-16 max-w-lg uppercase tracking-wider">
              <p>{work.description}</p>
            </div>

            {/* DYNAMIC TECH STACK & CLIENT INJECTED HERE */}
            <div className="text-[10px] uppercase tracking-widest text-white/40 space-y-2 mt-auto">
              <div>TECH STACK <span className="text-white/70 ml-2">{work.techStack?.join(" // ")}</span></div>
              <div>CLIENT <span className="text-white/70 ml-2">{work.client}</span></div>
            </div>
          </div>

          {/* RIGHT COLUMN: Gallery & Navigation */}
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-xl font-black uppercase tracking-tighter mb-8 font-druk">
              <TypewriterText text={`REYMARK.DEV: ${work.title}`} delay={400} speed={30} />
            </h2>

            {/* MULTIPLE IMAGES DYNAMICALLY RENDERED HERE */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-16">
              {work.images?.map((imgUrl, index) => {
                const num = index + 1;
                return (
                  <div
                    key={num}
                    className="flex flex-col gap-2 group"
                    onMouseEnter={() => setHoveredImage({ src: imgUrl, id: num })}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <div className="aspect-square bg-[#111] overflow-hidden cursor-pointer relative z-20">
                      <img
                        src={imgUrl}
                        className="w-full h-full object-cover transition-all duration-300"
                        alt={`Frame ${num}`}
                      />
                    </div>
                    <span className="text-[9px] text-white/40">0{num}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto w-full pt-12 relative z-20">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-[#1A1A1A] hover:bg-[#2A59E8] transition-colors py-3 text-[10px] uppercase tracking-widest text-white/70 cursor-pointer"
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