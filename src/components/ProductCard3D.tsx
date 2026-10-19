import { useState, useRef } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Box, Heart, Plus, Sparkles } from "lucide-react";
import type { Product } from "../data/products";
import { sound } from "../audio/soundEngine";

interface ProductCard3DProps {
  product: Product;
  index: number;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
}

export function ProductCard3D({
  product,
  index,
  onSelect,
  onQuickAdd,
  onToggleWishlist,
  isWishlisted,
}: ProductCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    setRotateX(-normY * 12);
    setRotateY(normX * 12);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }

  return (
    <motion.div
      ref={cardRef}
      className="product-card-3d-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => sound.playHover()}
      style={{
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <motion.div
        className="product-card-3d"
        animate={{
          rotateX,
          rotateY,
          scale: glarePos.opacity > 0 ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Holographic Specular Glare Layer */}
        <div
          className="card-glare"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35) 0%, rgba(56,189,248,0.18) 35%, transparent 70%)`,
            opacity: glarePos.opacity,
          }}
        />

        {/* Card Image Container */}
        <div className="card-image-box" onClick={() => onSelect(product)}>
          <img
            src={product.image}
            alt={product.name}
            className="card-img"
            loading="lazy"
          />

          {/* Top Overlays: Index and 4D coordinates */}
          <div className="card-top-tags">
            <span className="card-num">0{index + 1}</span>
            <span className="card-coord">
              W: {product.coord4D[3] > 0 ? `+${product.coord4D[3]}` : product.coord4D[3]}
            </span>
          </div>

          {/* Tag badge */}
          {product.tag && (
            <div className="card-tag-pill">
              <Sparkles size={11} />
              <span>{product.tag}</span>
            </div>
          )}

          {/* Floating Action Buttons */}
          <div className="card-floating-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className={`card-action-btn ${isWishlisted ? "active-heart" : ""}`}
              onClick={() => {
                sound.playClick();
                onToggleWishlist(product.id);
              }}
              aria-label="Save to wishlist"
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            <button
              className="card-action-btn inspect-trigger"
              onClick={() => {
                sound.playInspect();
                onSelect(product);
              }}
              aria-label="Inspect 4D Hologram"
              title="Inspect 4D Hologram"
            >
              <Box size={16} />
            </button>
          </div>

          {/* Quick Inspect Hover Banner */}
          <div className="card-hover-banner">
            <span>INSPECT IN 4D SPACE</span>
            <ArrowUpRight size={15} />
          </div>
        </div>

        {/* Card Metadata */}
        <div className="card-content">
          <div className="card-meta-row">
            <div>
              <span className="card-category">{product.category}</span>
              <h3 className="card-title" onClick={() => onSelect(product)}>
                {product.name}
              </h3>
            </div>
            <span className="card-price">${product.price}.00</span>
          </div>

          <p className="card-description">{product.description}</p>

          <div className="card-footer-action">
            <span className="card-finish">{product.materialFinish.split("&")[0]}</span>
            <button
              className="quick-add-btn"
              onClick={() => {
                sound.playAddBag();
                onQuickAdd(product);
              }}
              aria-label={`Quick add ${product.name} to bag`}
            >
              <Plus size={14} />
              <span>BAG</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
