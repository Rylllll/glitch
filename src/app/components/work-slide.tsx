import { motion } from "motion/react";
import { useRef } from "react";
import { GlitchText } from "./glitch-text";
import { AsciiScrollTransition } from "./AsciiScrollTransition"; // Adjust import path

export function WorkSlide({
  index,
  total,
  title,
  client,
  type,
  date,
  image // <-- Pass the image URL down to the slide
}: {
  index: number;
  total: number;
  title: string;
  client: string;
  type: string;
  date: string;
  image: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative" }}
      className="h-screen w-full snap-start overflow-hidden font-tronica text-white"
    >
      {/* BACKGROUND IMAGE - This sits underneath and gets revealed */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover"
        />
        {/* Dark overlay to ensure text is always readable against bright images */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      </div>

      {/* THE ASCII TRANSITION CANVAS OVERLAY */}
      <AsciiScrollTransition targetRef={containerRef} />

      {/* TOP BAR */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute inset-x-0 top-0 z-30 grid grid-cols-4 items-start p-6 text-[11px] uppercase tracking-widest"
      >
        <div>reymark</div>
        <nav className="flex flex-col gap-1">
          <a href="#works" className="w-fit"><GlitchText>WORKS</GlitchText></a>
          <a href="#about" className="w-fit"><GlitchText>ABOUT</GlitchText></a>
        </nav>
        <div className="flex flex-col gap-1 text-white/80">
          <a href="#" className="w-fit"><GlitchText>INSTAGRAM ↗</GlitchText></a>
          <a href="#contact" className="w-fit"><GlitchText>INFO@REYMARK.MOV</GlitchText></a>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span>PRODUCTION STUDIO</span>
          <span>MANILA, PHILIPPINES</span>
        </div>
      </motion.div>

      {/* MIDDLE ROW */}
      <div className="absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-6 text-[11px] uppercase tracking-widest text-white/80">
        <span>◉ SELECTED WORKS</span>
        <span className="text-white/60 absolute left-1/2 -translate-x-1/2">
          /{String(index + 1).padStart(2, "0")}
        </span>
        <span>/ {String(total).padStart(2, "0")}</span>
      </div>

      {/* BOTTOM */}
      <div className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-2 items-end gap-6 p-6 md:p-8">
        <motion.h2
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="uppercase leading-[0.9] text-5xl md:text-7xl tracking-tight mix-blend-difference"
        >
          <GlitchText trigger="auto">{title}</GlitchText>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 text-[11px] uppercase tracking-widest mix-blend-difference"
        >
          <div>
            <div className="text-white/40">CLIENTS</div>
            <div>{client}</div>
          </div>
          <div>
            <div className="text-white/40">TYPE</div>
            <div>{type}</div>
          </div>
          <div>
            <div className="text-white/40">DATE</div>
            <div>{date}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}