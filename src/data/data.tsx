export const WORK_PROJECTS = [
  {
    slug: "yamaha-ph",
    title: "YAMAHA PH",
    client: "Yamaha Motor Philippines",
    type: "Brand Website",
    date: "2025",
    image: "/images/yamaha/bg.png",
    images: [
      "/images/yamaha/1.png",
      "/images/yamaha/2.png",
      "/images/yamaha/3.png",
      "/images/yamaha/4.png",
      "/images/yamaha/5.png",
    ],
    description: "the official Philippine website of Yamaha Motor Philippines, Inc., focused on motorcycles, scooters, riding culture, and customer services. It serves as both a brand showcase and a digital platform for Yamaha riders in the Philippines. The site highlights Yamaha’s motorcycle lineup such as Mio, Aerox, NMAX, Sniper, and PG-1 models, along with dealer locators, service support, promotions, events, loyalty programs, and rider communities. Visually, the website uses a modern, sporty, and high-energy design style with bold typography, cinematic banners, dark-themed sections, dynamic motion graphics, and racing-inspired visuals to reflect speed, lifestyle, and performance culture.",
    techStack: ["Next.js", "Tailwind CSS", "Motion", "AWS", "Laravel"],
    link: "https://www.yamaha-motor.com.ph/"
  },
  {
    slug: "yamaha-racing-ph",
    title: "Yamaha Racing PH",
    client: "Yamaha Motor Philippines",
    type: "Brand Website",
    date: "2025",
    image: "/images/racing/bg.png",
    images: [
      "/images/racing/1.png",
      "/images/racing/2.png",
      "/images/racing/3.png",
      "/images/racing/4.png",
      "/images/racing/5.png",
      "/images/racing/6.png",
      "/images/racing/7.png",
      "/images/racing/8.png",
    ],
    description: "The Yamaha Racing Philippines website is a motorsports-focused subsite of Yamaha Motor Philippines dedicated to Yamaha’s racing culture, competitive teams, riders, and performance identity in the Philippines. Unlike the main Yamaha website which focuses on selling motorcycles and lifestyle branding, this section is specifically designed to showcase Yamaha’s involvement in motorcycle racing, track events, rider development, and motorsport communities",
    techStack: ["Next.js", "Tailwind CSS", "Motion", "AWS", "Laravel"],
    link: "https://www.yamaha-motor.com.ph/yamaha-racing"
  },

];

export const PERSONAL_PROJECTS = [
  {
    slug: "pokedex-ph",
    title: "Pokedex PH",
    client: "Personal Project",
    type: "Information website",
    date: "2026",
    image: "/images/pokemon/homepage.png",
    images: [
      "/images/pokemon/pokedex.png",
      "/images/pokemon/overview.png",
      "/images/pokemon/capture.png",
      "/images/pokemon/pokedata.png",
      "/images/pokemon/tcg.png",
      "/images/pokemon/pc.png",
      "/images/pokemon/capture.png",
      "/images/pokemon/card.png",
    ],
    description: "PokéWeb OS is a modernized, terminal-based interface designed to compile the world's Pokemon data into one fluid, accessible mainframe.",
    techStack: ["Next.js", "GSAP", "Framer Motion", "Tailwind CSS", "Poke Api", "TCG Api", "Mongo DB"],
    link: "https://pokemon-ph.rynath.dev/"
  },
  {
    slug: "curators-archive",
    title: "Curators archive",
    client: "Personal Project",
    type: "Information website",
    date: "2026",
    image: "/images/museum/bg.png",
    images: [
      "/images/museum/gallery.png",
      "/images/museum/homepage.png",
      "/images/museum/menu.png",
      "/images/museum/painting.png",
      "/images/museum/photography.png",
      "/images/museum/sculpture.png",
      "/images/museum/saved.png",
      "/images/museum/overlay.png",
      "/images/museum/overview.png",
    ],
    description: "OUR COLLECTION EMBODIES A DELICATE BALANCE OF HISTORICAL DEPTH AND INNOVATIVE EXPRESSION, CREATING AN IMMERSIVE EXPERIENCE OF TIMELESS ELEGANCE AND INTELLECTUAL ALLURE.",
    techStack: ["Next.js", "GSAP", "Framer Motion", "Tailwind CSS", "Figma", "Museum API"],
    link: "https://curators-archive.rynath.dev/"
  },
  {
    slug: "floral-lexicon",
    title: "floral lexicon",
    client: "Personal Project",
    type: "Information website",
    date: "2026",
    image: "/images/flower/bg.png",
    images: [
      "/images/flower/exhibition.png",
      "/images/flower/encyclopedia.png",
      "/images/flower/overview.png",
      "/images/flower/overview2.png",
      "/images/flower/overview3.png",
    ],
    description: "A digital flower encyclopedia wrapped in an elegant and minimal aesthetic. It presents itself as a living archive of flowers, where visitors can browse and search through thousands of blooms while exploring their meanings, symbolism, histories, classifications, and growing details.",
    techStack: ["Next.js", "GSAP", "Framer Motion", "Tailwind CSS", "Figma"],
    link: "https://flower-archive.rynath.dev/"
  }
];

export const TECH_STACK = [
  {
    code: "01",
    label: "FRONTEND",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    code: "02",
    label: "CREATIVE DEV",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    items: ["Three.js / WebGL", "GSAP / Motion", "Canvas API", "Shaders (GLSL)"],
  },
  {
    code: "03",
    label: "BACKEND",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    items: ["Node.js", "PostgreSQL", "Supabase", "REST & GraphQL"],
  },
  {
    code: "04",
    label: "DESIGN / TOOLS",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
      </svg>
    ),
    items: ["Figma", "Adobe Creative Suite", "Git / Vercel", "Cursor / AI Workflows"],
  },
];