// data.tsx

export const WORKS = [
  {
    slug: "pokedex-ph",
    title: "Pokedex PH",
    client: "SAMSUNG",
    type: "COMMERCIAL",
    date: "2026",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=3174&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=3174&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=3174&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=3175&auto=format&fit=crop"
    ],
    description: "A comprehensive digital ecosystem built for Samsung to showcase the evolution of mobile interfaces. The project merges brutalist design with fluid WebGL interactions, creating an immersive product experience that breaks away from traditional corporate constraints.",
    techStack: ["Next.js", "Three.js", "Framer Motion", "Tailwind CSS"]
  },
  {
    slug: "kasy",
    title: "KÄSY",
    client: "MCDONALDS",
    type: "COMMERCIAL",
    date: "2025",
    image: "https://images.unsplash.com/photo-1773332598414-44a45e364d85?q=80&w=687&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1773332598414-44a45e364d85?q=80&w=687&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=3174&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=3174&auto=format&fit=crop"
    ],
    description: "An interactive, gamified ordering experience conceptualized for McDonald's. KÄSY redefines the kiosk interface by introducing micro-interactions, custom shaders, and an ultra-responsive layout tailored for Gen-Z consumers.",
    techStack: ["React", "GLSL Shaders", "Zustand", "Figma"]
  },
  {
    slug: "echo-chamber",
    title: "ECHO/CHAMBER",
    client: "SONY",
    type: "MUSIC VIDEO",
    date: "2025",
    image: "https://plus.unsplash.com/premium_photo-1773954455018-901a7a9f13bc?q=80&w=1174&auto=format&fit=crop",
    images: [
      "https://plus.unsplash.com/premium_photo-1773954455018-901a7a9f13bc?q=80&w=1174&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=3174&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3128&auto=format&fit=crop"
    ],
    description: "A generative audio-visual web experience acting as the companion piece for Sony's new artist launch. Real-time audio frequency data drives the distortion and displacement of 3D objects directly in the browser.",
    techStack: ["Web Audio API", "WebGL", "GSAP", "React Fiber"]
  },
  {
    slug: "afterglow",
    title: "AFTERGLOW",
    client: "NIKE",
    type: "BRAND FILM",
    date: "2024",
    image: "https://images.unsplash.com/photo-1773332585698-cba3c91b73e4?q=80&w=1169&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1773332585698-cba3c91b73e4?q=80&w=1169&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=3087&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=3174&auto=format&fit=crop"
    ],
    description: "A web-based digital lookbook for Nike's experimental streetwear line. Afterglow utilizes smooth scroll hijacking, dynamic typographic masks, and cinematic transitions to mirror the energy of the brand.",
    techStack: ["Next.js", "Lenis Scroll", "Motion", "Supabase"]
  },
];

export const TECH_STACK = [
  {
    code: "01",
    label: "FRONTEND",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    items: ["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    code: "02",
    label: "CREATIVE DEV",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    items: ["Three.js / WebGL", "GSAP / Motion", "Canvas API", "Shaders (GLSL)"],
  },
  {
    code: "03",
    label: "BACKEND",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    items: ["Node.js", "PostgreSQL", "Supabase", "REST & GraphQL"],
  },
  {
    code: "04",
    label: "DESIGN / TOOLS",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
      </svg>
    ),
    items: ["Figma", "Adobe Creative Suite", "Git / Vercel", "Cursor / AI Workflows"],
  },
];