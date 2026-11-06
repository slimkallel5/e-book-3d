"use client";

import GlassyCarousel, { type GlassyCarouselItem } from "@/components/ui/glassy-coverflow-carousel";

export const films: GlassyCarouselItem[] = [
  { id: "john-wick-chapter-4", title: "John Wick: Chapter 4", subtitle: "2023 · Action thriller", image: "https://cdn.21st.dev/assets/mirror/08/082b9906ebb53cd3b6f6d440bef34d2775d595fff6bb594d151b3955b7d6547f.jpg", accent: "#b34b32", description: "John Wick takes his fight against the High Table across the world in pursuit of his freedom.", trailerUrl: "https://www.youtube.com/watch?v=qEVUtrk8_B4" },
  { id: "mad-max-fury-road", title: "Mad Max: Fury Road", subtitle: "2015 · Post-apocalyptic action", image: "https://cdn.21st.dev/assets/mirror/fc/fc84689717cc1be69a14288f7c80bb23691945e5bbc0cbf130794535bea19bfe.jpg", accent: "#b67c35", description: "Max and Furiosa race across the wasteland with a ruthless warlord in pursuit.", trailerUrl: "https://www.youtube.com/watch?v=hEJnMQG9ev8" },
  { id: "mission-impossible-fallout", title: "Mission: Impossible - Fallout", subtitle: "2018 · Spy action", image: "https://cdn.21st.dev/assets/mirror/fc/fc6c5c2f066101e691c1af692b831dffa3de36bce5560468756291bfdc94a26d.jpg", accent: "#4d7d96", description: "Ethan Hunt and his team race to recover stolen plutonium after a mission goes wrong.", trailerUrl: "https://www.youtube.com/watch?v=wb49-oV0F78" },
  { id: "extraction-2", title: "Extraction 2", subtitle: "2023 · Action thriller", image: "https://cdn.21st.dev/assets/mirror/b8/b8494cc64fa7efcd394d94f33ba4e6ca83bc720343004709a30eb4f62fb74998.jpg", accent: "#537d83", description: "Tyler Rake returns for a dangerous rescue mission to extract a family from a Georgian prison.", trailerUrl: "https://www.youtube.com/watch?v=Y274jZs5s7s" },
  { id: "the-fall-guy", title: "The Fall Guy", subtitle: "2024 · Action comedy", image: "https://cdn.21st.dev/assets/mirror/ae/aed0fd6aa0191bebc801afcf8861824afa25373a61a5aec1bdb542aaa7668a25.jpg", accent: "#b45172", description: "A stunt performer searches for a missing movie star while trying to save the film and win back its director.", trailerUrl: "https://www.youtube.com/watch?v=j7jPnwVGdZ8" },
];

// The example skin is instance-scoped and never changes the installing site's CSS.
const brandTheme = {
  "--color-background": "light-dark(#f5f8ff, #06122d)",
  "--color-foreground": "light-dark(#10244a, #f1f7ff)",
  "--color-card": "light-dark(#ffffff, #101e37)",
  "--color-card-foreground": "light-dark(#10244a, #f1f7ff)",
  "--color-muted-foreground": "light-dark(#49617f, #b7cbee)",
  "--color-border": "light-dark(#c7d3e7, #7891b94d)",
  "--color-primary": "light-dark(#2457d6, #91abff)",
  "--color-primary-foreground": "light-dark(#ffffff, #10244a)",
  "--carousel-shadow-color": "#020817"
} as import("react").CSSProperties;

const settings = { autoPlay: false, useHostTheme: true };

export default function GlassyCarouselDemo(props: Partial< typeof settings> = {}) {
  const s = { ...settings, ...props };
  return <div style={{ width: "100%", minWidth: 0, alignSelf: "stretch" }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600&display=swap');`}</style>
    <GlassyCarousel items={films} layout="poster" initialIndex={2} autoPlay={s.autoPlay} label="Action movie trailers" style={{ ...(s.useHostTheme ? {} : brandTheme), "--carousel-font-body": "Inter, sans-serif", "--carousel-font-display": "Outfit, sans-serif" } as import("react").CSSProperties} brand={{ image: "https://cdn.21st.dev/assets/mirror/2f/2f81e5e65fbf7fb6bbf39c311525f9df8286159ec678902cff19259ceb2923dc.png", lightImage: "https://cdn.21st.dev/assets/mirror/f1/f10c2108f47eb5771ed06592aac142dc67fd7890a23c520d7b35f2ba608894a1.png", alt: "Automate Flows", href: "https://automateflows.io/" }} />
  </div>;
}
