import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Sparkles,
  Palette,
  X,
} from "lucide-react";
import { products } from "./data/products";
import type { Product } from "./data/products";
import { DimensionCanvas } from "./components/DimensionCanvas";
import type { DimensionMode, ColorEpoch } from "./components/DimensionCanvas";
import type { WaveMaterialMode } from "./components/KineticWave3D";
import { ProductCard3D } from "./components/ProductCard3D";
import { ProductInspector3D } from "./components/ProductInspector3D";
import { ChronoTimeline } from "./components/ChronoTimeline";
import { DimensionShowcase } from "./components/DimensionShowcase";
import { BagDrawer } from "./components/BagDrawer";
import type { CartItem } from "./components/BagDrawer";
import { WishlistDrawer } from "./components/WishlistDrawer";
import { Cursor4D } from "./components/Cursor4D";
import { SoundEqualizer } from "./components/SoundEqualizer";
import { sound } from "./audio/soundEngine";
import "./index.css";

export default function App() {
  // Dimensional & Temporal State (Default: Wave mode matching reference video)
  const [epoch, setEpoch] = useState<ColorEpoch>("quantum");
  const [dimensionMode, setDimensionMode] = useState<DimensionMode>("wave");
  const [wavePalette, setWavePalette] = useState<WaveMaterialMode>("prismatic");
  const [warpSpeed, setWarpSpeed] = useState<number>(1.0);
  const [coords4D, setCoords4D] = useState<[number, number, number, number]>([0.42, -0.18, 1.05, 0.77]);

  // Product Selection & Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([1, 6]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  // Category Filtering
  const [category, setCategory] = useState("All pieces");
  const categories = ["All pieces", ...Array.from(new Set(products.map((p) => p.category)))];
  const visibleProducts =
    category === "All pieces" ? products : products.filter((p) => p.category === category);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function notify(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2800);
  }

  function handleAddToCart(product: Product, quantity: number = 1) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    notify(`${product.name} materialized in bag`);
  }

  function handleChangeQuantity(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handleRemoveFromCart(id: number) {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    notify("Item displaced from bag");
  }

  function handleToggleWishlist(id: number) {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    notify(wishlist.includes(id) ? "Removed from 4D wishlist" : "Saved to 4D wishlist");
  }

  function scrollToSection(id: string) {
    sound.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <main className={`market-app epoch-${epoch}`}>
      {/* 4D Custom Interactive Cursor */}
      <Cursor4D />

      {/* Top Navigation Bar: Minimalist Haute Couture from Video Reference */}
      <header className="topbar">
        <div className="brand-group">
          <button
            className="brand"
            onClick={() => {
              sound.playClick();
              setSelectedProduct(null);
              setCartOpen(false);
              setWishlistOpen(false);
            }}
            aria-label="MarketMuse Home"
          >
            MARKETMUSE
          </button>
          <span className="brand-subtext">THE 4D WAY TO WEAR SPATIAL HAUTE COUTURE.</span>
        </div>

        <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
          <a
            href="#stage"
            onClick={() => {
              sound.playClick();
              setMenuOpen(false);
            }}
          >
            PRODUCT <ChevronDown size={11} className="nav-chevron" />
          </a>
          <a
            href="#collection"
            onClick={() => {
              sound.playClick();
              setMenuOpen(false);
            }}
          >
            SOLUTIONS <ChevronDown size={11} className="nav-chevron" />
          </a>
          <a
            href="#story"
            onClick={() => {
              sound.playClick();
              setMenuOpen(false);
            }}
          >
            LEARN <ChevronDown size={11} className="nav-chevron" />
          </a>
        </nav>

        <div className="top-actions">
          {/* Audio Synthesizer Toggle */}
          <SoundEqualizer />

          {/* Wishlist Button */}
          <button
            className="sign-in-btn"
            onClick={() => {
              sound.playClick();
              setWishlistOpen(true);
            }}
            title="Saved in Hyperspace"
          >
            <Heart size={14} />
            <span>SAVED ({wishlist.length})</span>
          </button>

          {/* Bag Button: Bracketed Style from Video */}
          <button
            className="bracket-button"
            onClick={() => {
              sound.playClick();
              setCartOpen(true);
            }}
            aria-label="Shopping Bag"
          >
            [ BAG ({cartCount}) ]
          </button>

          {/* Get In Touch Button */}
          <button
            className="bracket-button highlight-btn"
            onClick={() => {
              sound.playInspect();
              setSelectedProduct(products[0]);
            }}
          >
            [ GET IN TOUCH ]
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Hero Section: Exact Iconic Layout from Video */}
      <section className="video-hero-stage" id="stage">
        {/* Split Top Header Row */}
        <div className="hero-title-grid">
          <div className="hero-title-col-left">
            <h1 className="hero-video-heading">
              YOUR WARDROBE&apos;S COMMAND<br />
              CENTER FOR 4D TIMELESS<br />
              ELEGANCE.
            </h1>
            <div className="hero-kicker-tag">
              <span className="kicker-star">✳</span>
              <span>V. 1.4 NOW AVAILABLE // 2026 EDIT</span>
            </div>
          </div>

          <div className="hero-title-col-right">
            <p className="hero-video-lead">
              Get your personal wardrobe on the exact same page. Delegate everyday choices in
              seconds, inspect non-Euclidean draping, and experience real-time 4-dimensional
              kinetic tailoring.
            </p>
          </div>
        </div>

        {/* Center: The 3D Sliced Wave / 4D Kinetic Sculpture */}
        <div className="sculpture-viewport-wrapper">
          <DimensionCanvas
            mode={dimensionMode}
            epoch={epoch}
            warpSpeed={warpSpeed}
            wavePalette={wavePalette}
            onCoordUpdate={setCoords4D}
            onWaveClick={(idx) => {
              sound.playInspect();
              const p = products[idx % products.length];
              setSelectedProduct(p);
            }}
          />
        </div>

        {/* Center Prompt Callout under the Wave */}
        <div className="hero-center-callout">
          <p className="callout-prompt">
            Are you ready to explore the first 4D haute couture edit?
          </p>
          <button
            className="cta-pill-button"
            onClick={() => scrollToSection("collection")}
          >
            <span>EXPLORE THE CAPSULE</span>
          </button>
        </div>

        {/* Bottom Hero Control Bar */}
        <div className="hero-bottom-bar">
          <button
            className="discover-more-btn"
            onClick={() => scrollToSection("collection")}
          >
            <ArrowDown size={14} />
            <span>DISCOVER MORE</span>
          </button>

          {/* Interactive Fabric Swatch Palette Switcher */}
          {dimensionMode === "wave" && (
            <div className="wave-palette-bar">
              <span className="dock-status-label">
                <Palette size={12} /> SWATCH:
              </span>
              <button
                className={`palette-chip ${wavePalette === "prismatic" ? "palette-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setWavePalette("prismatic");
                }}
              >
                Prismatic Acrylic
              </button>
              <button
                className={`palette-chip ${wavePalette === "silk_gold" ? "palette-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setWavePalette("silk_gold");
                }}
              >
                Silk &amp; Gold
              </button>
              <button
                className={`palette-chip ${wavePalette === "obsidian" ? "palette-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setWavePalette("obsidian");
                }}
              >
                Obsidian Matrix
              </button>
            </div>
          )}

          {/* Telemetry and Mode switch */}
          <div className="hero-mode-dock">
            <span className="dock-status-label">
              <Sparkles size={12} /> 4D STAGE:
            </span>
            <button
              className={`dock-chip ${dimensionMode === "wave" ? "dock-chip-active" : ""}`}
              onClick={() => {
                sound.playClick();
                setDimensionMode("wave");
              }}
            >
              KINETIC WAVE
            </button>
            <button
              className={`dock-chip ${dimensionMode === "tesseract" ? "dock-chip-active" : ""}`}
              onClick={() => {
                sound.playWarp();
                setDimensionMode("tesseract");
              }}
            >
              4D TESSERACT
            </button>
            <button
              className={`dock-chip ${dimensionMode === "singularity" ? "dock-chip-active" : ""}`}
              onClick={() => {
                sound.playWarp();
                setDimensionMode("singularity");
              }}
            >
              QUANTUM FLUX
            </button>
          </div>
        </div>

        {/* Interactive Chrono Timeline Slider */}
        <div className="timeline-container-wrap">
          <ChronoTimeline
            epoch={epoch}
            onEpochChange={setEpoch}
            mode={dimensionMode}
            onModeChange={setDimensionMode}
            warpSpeed={warpSpeed}
            onWarpSpeedChange={setWarpSpeed}
            coords={coords4D}
          />
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="collection-marquee" aria-hidden="true">
        <div>
          NON-EUCLIDEAN FORM <span>✳</span> 4-DIMENSIONAL SPATIAL DRAPE <span>✳</span> ZERO-G KINETICS <span>✳</span> PHOTONIC NANO-WEAVE <span>✳</span> NON-EUCLIDEAN FORM <span>✳</span> 4-DIMENSIONAL SPATIAL DRAPE <span>✳</span> ZERO-G KINETICS <span>✳</span> PHOTONIC NANO-WEAVE <span>✳</span>
        </div>
      </div>

      {/* Collection Section */}
      <section className="collection-bar" id="collection">
        <div className="collection-header-row">
          <div>
            <span className="section-eyebrow">
              <Sparkles size={13} /> THE FIRST EDIT // 2026
            </span>
            <h2>Objects of Desire in 4D.</h2>
          </div>

          <p className="collection-lead">
            Six architectural pieces forged with shape-memory bonds and optical micro-lattices.
            Click any card to launch the interactive 3D Holographic Inspector.
          </p>

          <button
            className="collection-action"
            onClick={() => {
              sound.playInspect();
              setSelectedProduct(products[0]);
            }}
          >
            LAUNCH 4D LAB
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Collection Filter & Count Bar */}
        <div className="collection-tools">
          <div className="tools-count">
            <span>{visibleProducts.length} OBJECTS IN REPERTOIRE</span>
          </div>

          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill-btn ${category === cat ? "pill-active" : ""}`}
                onClick={() => {
                  sound.playClick();
                  setCategory(cat);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Gyro Interactive Product Cards Grid */}
        <div className="product-strip">
          {visibleProducts.map((product, index) => (
            <ProductCard3D
              key={product.id}
              product={product}
              index={index}
              onSelect={setSelectedProduct}
              onQuickAdd={(p) => handleAddToCart(p, 1)}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </section>

      {/* Interactive 4D Atelier Section */}
      <DimensionShowcase />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">
          market<span>muse</span>.
          <p>
            Independent style, reimagined across four dimensions.<br />
            Engineered in our zero-gravity kinetic design atelier.
          </p>
        </div>

        <div className="footer-meta-nav">
          <div className="footer-nav-col">
            <span className="footer-col-title">NAVIGATION</span>
            <a href="#stage">4D Stage</a>
            <a href="#collection">Chrono Collection</a>
            <a href="#story">Atelier 4D</a>
          </div>
          <div className="footer-nav-col">
            <span className="footer-col-title">HYPERSPACE</span>
            <span>Epoch: {epoch.toUpperCase()}</span>
            <span>Projection: {dimensionMode.toUpperCase()}</span>
            <span>Latency: &lt; 0.4ms</span>
          </div>
        </div>

        <div className="footer-right">
          <span>HIGH-DIMENSIONAL FASHION</span>
          <span>© MARKETMUSE 2026 // ALL DIMENSIONS RESERVED</span>
        </div>
      </footer>

      {/* 4D Spatial Product Inspector Modal */}
      {selectedProduct && (
        <ProductInspector3D
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.includes(selectedProduct.id)}
        />
      )}

      {/* Shopping Bag Drawer */}
      <BagDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onChangeQuantity={handleChangeQuantity}
        onRemoveItem={handleRemoveFromCart}
        onSelectProduct={setSelectedProduct}
        onNotify={notify}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={setSelectedProduct}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Dynamic Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={16} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
