import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Compass, Sparkles, Orbit, Waves } from "lucide-react";
import { sound } from "../audio/soundEngine";

const PILLARS = [
  {
    id: "temporal",
    title: "TEMPORAL DRAPE",
    dimension: "DIMENSION W: REACTION",
    icon: Waves,
    tagline: "Fabrics that remember their origin state across time.",
    details:
      "Unlike static 3D silhouettes, our 4D Chrono textiles integrate programmable shape-memory molecular bonds. When exposed to motion, gravity variations, or kinetic tension, the garment naturally re-aligns its micro-drape along the 4th dimensional vector, eliminating creasing and creating effortless architectural poise.",
    stats: [
      { label: "Memory Retention", val: "99.98%" },
      { label: "Drape Adaptation", val: "< 12ms" },
      { label: "Weight Density", val: "42g / m²" },
    ],
  },
  {
    id: "quantum",
    title: "PHOTONIC WEAVE",
    dimension: "DIMENSION W: DISPERSION",
    icon: Sparkles,
    tagline: "Light-refractive nano-lattices adapting to circadian luminance.",
    details:
      "Engineered with microscopic prism cavities that refract ambient light frequencies. Under morning daylight, the surface radiates a soft pearlescent titanium; under nocturnal artificial spotlights, it deepens into an obsidian holographic gleam with deep chromatic dispersion.",
    stats: [
      { label: "Light Refraction", val: "480–720nm" },
      { label: "Prism Cavities", val: "2.4M / cm²" },
      { label: "Thermal Delta", val: "± 0.2°C" },
    ],
  },
  {
    id: "zerog",
    title: "ZERO-G TAILORING",
    dimension: "DIMENSION W: SUSPENSION",
    icon: Orbit,
    tagline: "Weight distribution calibrated for planetary and orbital movement.",
    details:
      "Crafted with internal aerogel suspension ribbons that counteract kinetic pressure points. The silhouette floats millimetres off the skin, generating an unprecedented sensation of structural weightlessness while maintaining razor-sharp architectural contours.",
    stats: [
      { label: "Gravity Offset", val: "40% Feel" },
      { label: "Air Permeability", val: "180 L/m²/s" },
      { label: "Elastic Modulus", val: "3.2 GPa" },
    ],
  },
  {
    id: "hardware",
    title: "POLYTAL HARDWARE",
    dimension: "DIMENSION W: TOPOLOGY",
    icon: Box,
    tagline: "Non-Euclidean magnetic levitation closures and titanium hinges.",
    details:
      "Every clasp, zipper, and fastener is precision-milled from aerospace Grade 5 Titanium with neodymium magnetic guidance. Closures snap into alignment with an acoustic haptic click that feels both otherworldly and completely intuitive.",
    stats: [
      { label: "Cycle Lifespan", val: "500,000+" },
      { label: "Closure Precision", val: "0.01mm" },
      { label: "Magnetic Flux", val: "1.4 Tesla" },
    ],
  },
];

export function DimensionShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const current = PILLARS[activeTab];
  const IconComponent = current.icon;

  return (
    <section className="showcase-section" id="story">
      <div className="showcase-header">
        <div className="showcase-header-left">
          <span className="section-eyebrow">
            <Compass size={12} /> THE ATELIER IN 4D
          </span>
          <h2 className="showcase-title">
            Beyond 3D space.<br />
            <em>The luxury of time.</em>
          </h2>
        </div>
        <p className="showcase-subtitle">
          MarketMuse merges algorithmic 4-dimensional mathematics with the tactile grace of haute
          couture. Explore the 4 engineering pillars defining the next era of personal adornment.
        </p>
      </div>

      {/* Interactive Pillar Selector Navigation */}
      <div className="pillar-tabs">
        {PILLARS.map((pillar, idx) => {
          const isActive = idx === activeTab;
          const TabIcon = pillar.icon;
          return (
            <button
              key={pillar.id}
              className={`pillar-tab-btn ${isActive ? "pillar-tab-active" : ""}`}
              onClick={() => {
                sound.playClick();
                setActiveTab(idx);
              }}
              onMouseEnter={() => sound.playHover()}
            >
              <div className="tab-btn-header">
                <span className="tab-idx">0{idx + 1}</span>
                <TabIcon size={16} />
              </div>
              <span className="tab-title">{pillar.title}</span>
              <span className="tab-dim">{pillar.dimension}</span>
              {isActive && (
                <motion.div
                  className="pillar-active-bar"
                  layoutId="pillarActiveIndicator"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Pillar Card / Anatomy Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="pillar-display-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          <div className="display-card-content">
            <div className="display-card-badge">
              <IconComponent size={14} />
              <span>{current.dimension}</span>
            </div>

            <h3 className="display-card-heading">{current.title}</h3>
            <p className="display-card-tagline">{current.tagline}</p>
            <p className="display-card-text">{current.details}</p>

            {/* Metrics */}
            <div className="pillar-metrics">
              {current.stats.map((stat, i) => (
                <div key={i} className="metric-box">
                  <span className="metric-val">{stat.val}</span>
                  <span className="metric-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="display-card-visual">
            <div className="visual-hologram-ring">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
              <div className="core-glyph">
                <IconComponent size={42} />
              </div>
            </div>
            <div className="visual-caption">
              <span>MARKETMUSE // LABORATORY SIMULATION</span>
              <span>ℝ⁴ COORDINATE FIELD 2026</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
