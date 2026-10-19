import { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Layers, Eye, Sparkles, Check, Sliders, Wind } from "lucide-react";
import type { Product } from "../data/products";
import { sound } from "../audio/soundEngine";

type MaterialType = "obsidian" | "gold" | "quartz" | "titanium";
type MotionMode = "still" | "runway" | "zerog";

interface ProductInspector3DProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
}

function HologramGeometry({
  type,
  material,
  exploded,
  wireframe,
  slice,
  motionMode,
}: {
  type: Product["geometryType"];
  material: MaterialType;
  exploded: boolean;
  wireframe: boolean;
  slice: number;
  motionMode: MotionMode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const part1Ref = useRef<THREE.Mesh>(null);
  const part2Ref = useRef<THREE.Mesh>(null);
  const part3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Rotation and kinetic drape physics depending on motion mode
    if (motionMode === "runway") {
      groupRef.current.rotation.y = Math.sin(t * 1.8) * 0.4 + t * 0.2;
      groupRef.current.position.y = Math.sin(t * 3.6) * 0.12;
      groupRef.current.rotation.z = Math.cos(t * 1.8) * 0.08;
    } else if (motionMode === "zerog") {
      groupRef.current.rotation.y = t * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 0.8) * 0.18;
      groupRef.current.rotation.z = Math.cos(t * 0.6) * 0.14;
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.2;
    } else {
      groupRef.current.rotation.y = t * 0.35;
      groupRef.current.position.y = 0;
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;
    }

    // Exploded view animation interpolation
    const explodeOffset = exploded ? 1.25 : 0;
    if (part1Ref.current) {
      part1Ref.current.position.y = THREE.MathUtils.lerp(part1Ref.current.position.y, explodeOffset * 0.9, 0.1);
      part1Ref.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
    if (part2Ref.current) {
      part2Ref.current.position.y = THREE.MathUtils.lerp(part2Ref.current.position.y, -explodeOffset * 0.9, 0.1);
      part2Ref.current.rotation.z = Math.cos(t * 0.5) * 0.1;
    }
    if (part3Ref.current) {
      part3Ref.current.position.z = THREE.MathUtils.lerp(part3Ref.current.position.z, explodeOffset * 1.1, 0.1);
    }
  });

  const matProps = {
    obsidian: {
      color: "#0a0a0c",
      emissive: "#1e1b4b",
      roughness: 0.1,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe,
    },
    gold: {
      color: "#f59e0b",
      emissive: "#78350f",
      roughness: 0.15,
      metalness: 0.98,
      clearcoat: 0.9,
      wireframe,
    },
    quartz: {
      color: "#e0e7ff",
      emissive: "#6366f1",
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.88,
      thickness: 1.5,
      ior: 1.6,
      clearcoat: 1.0,
      wireframe,
    },
    titanium: {
      color: "#e2e8f0",
      emissive: "#0284c7",
      roughness: 0.25,
      metalness: 0.85,
      clearcoat: 0.6,
      wireframe,
    },
  }[material];

  return (
    <group ref={groupRef} scale={slice}>
      {type === "coat" && (
        <>
          <mesh ref={part1Ref}>
            <torusKnotGeometry args={[1.2, 0.35, 128, 32, 2, 3]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh ref={part2Ref}>
            <cylinderGeometry args={[0.4, 0.8, 2.2, 32, 1, true]} />
            <meshPhysicalMaterial {...matProps} wireframe={true} />
          </mesh>
        </>
      )}

      {type === "gem" && (
        <>
          <mesh ref={part1Ref}>
            <icosahedronGeometry args={[1.4, 0]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh ref={part2Ref}>
            <octahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={2}
              wireframe
            />
          </mesh>
        </>
      )}

      {type === "sneaker" && (
        <>
          <mesh ref={part1Ref} position={[0, 0.4, 0]}>
            <boxGeometry args={[2.5, 0.8, 1.2]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh ref={part2Ref} position={[0, -0.4, 0]}>
            <boxGeometry args={[2.8, 0.6, 1.4]} />
            <meshStandardMaterial
              color={material === "gold" ? "#f59e0b" : "#38bdf8"}
              wireframe
            />
          </mesh>
          <mesh ref={part3Ref} position={[-1.2, 0.2, 0]}>
            <torusGeometry args={[0.45, 0.12, 16, 32]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        </>
      )}

      {type === "bag" && (
        <>
          <mesh ref={part1Ref}>
            <dodecahedronGeometry args={[1.3, 0]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh ref={part2Ref} position={[0, 1.3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.9, 0.08, 16, 40, Math.PI]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={1}
              roughness={0.1}
            />
          </mesh>
        </>
      )}

      {type === "sculpture" && (
        <>
          <mesh ref={part1Ref}>
            <torusGeometry args={[1.3, 0.38, 30, 100]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh ref={part2Ref} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.1, 0.25, 24, 80]} />
            <meshPhysicalMaterial {...matProps} wireframe />
          </mesh>
        </>
      )}

      {type === "ring" && (
        <>
          <mesh ref={part1Ref}>
            <torusGeometry args={[1.2, 0.18, 32, 64]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh ref={part2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
            <torusGeometry args={[1.4, 0.12, 32, 64]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
          <mesh ref={part3Ref} position={[0, 0, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial
              color="#f43f5e"
              emissive="#f43f5e"
              emissiveIntensity={2.5}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export function ProductInspector3D({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: ProductInspector3DProps) {
  const [material, setMaterial] = useState<MaterialType>("obsidian");
  const [exploded, setExploded] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [slice, setSlice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [motionMode, setMotionMode] = useState<MotionMode>("still");

  const materials: { id: MaterialType; label: string; dotColor: string }[] = [
    { id: "obsidian", label: "Obsidian", dotColor: "#171613" },
    { id: "gold", label: "Liquid Gold", dotColor: "#d97706" },
    { id: "quartz", label: "Prism Quartz", dotColor: "#818cf8" },
    { id: "titanium", label: "Titanium", dotColor: "#94a3b8" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="inspector-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            sound.playClose();
            onClose();
          }
        }}
      >
        <motion.div
          className="inspector-container"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Close Button */}
          <button
            className="inspector-close-btn"
            onClick={() => {
              sound.playClose();
              onClose();
            }}
            aria-label="Close 4D Inspector"
          >
            <X size={20} />
          </button>

          {/* Left Column: Interactive 3D Holographic Chamber */}
          <div className="inspector-viewport">
            <div className="viewport-overlay-top">
              <span className="hologram-live-badge">
                <i className="pulse-dot" /> 4D SPATIAL RECONSTRUCTION
              </span>
              <span className="coord-hud">
                4D: [{product.coord4D.join(", ")}]
              </span>
            </div>

            {/* Three.js Canvas */}
            <div className="inspector-canvas-wrapper">
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 6.2], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={1.5} />
                <directionalLight position={[4, 6, 6]} intensity={2.4} />
                <pointLight position={[-4, 2, 3]} color="#38bdf8" intensity={28} />
                <pointLight position={[4, -2, 2]} color="#c084fc" intensity={25} />

                <Suspense fallback={null}>
                  <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
                    <HologramGeometry
                      type={product.geometryType}
                      material={material}
                      exploded={exploded}
                      wireframe={wireframe}
                      slice={slice}
                      motionMode={motionMode}
                    />
                  </Float>
                </Suspense>

                <OrbitControls enablePan={false} enableZoom={true} maxDistance={9} minDistance={3.5} />
              </Canvas>
            </div>

            {/* Bottom 3D Viewport Toolbar Controls */}
            <div className="viewport-toolbar">
              <div className="tool-buttons">
                <button
                  className={`tool-btn ${exploded ? "tool-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setExploded(!exploded);
                  }}
                  title="Toggle Exploded Layers"
                >
                  <Layers size={14} />
                  <span>Explode Layers</span>
                </button>

                <button
                  className={`tool-btn ${wireframe ? "tool-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setWireframe(!wireframe);
                  }}
                  title="Toggle Quantum Wireframe"
                >
                  <Eye size={14} />
                  <span>X-Ray Wireframe</span>
                </button>
              </div>

              {/* Kinetic Motion Drape Mode */}
              <div className="tool-buttons">
                <span className="picker-label">DRAPE:</span>
                <button
                  className={`tool-btn ${motionMode === "still" ? "tool-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setMotionMode("still");
                  }}
                >
                  Still
                </button>
                <button
                  className={`tool-btn ${motionMode === "runway" ? "tool-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setMotionMode("runway");
                  }}
                  title="Simulate Stride & Wind"
                >
                  <Wind size={13} />
                  Runway
                </button>
                <button
                  className={`tool-btn ${motionMode === "zerog" ? "tool-active" : ""}`}
                  onClick={() => {
                    sound.playClick();
                    setMotionMode("zerog");
                  }}
                  title="Simulate Zero-G Float"
                >
                  <Sparkles size={13} />
                  Zero-G
                </button>
              </div>

              {/* Material Finish Palette */}
              <div className="material-picker">
                <span className="picker-label">FINISH:</span>
                {materials.map((m) => (
                  <button
                    key={m.id}
                    className={`material-chip ${material === m.id ? "chip-active" : ""}`}
                    onClick={() => {
                      sound.playClick();
                      setMaterial(m.id);
                    }}
                  >
                    <span className="chip-dot" style={{ background: m.dotColor }} />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Dimensional Scale / Slice Slider */}
              <div className="dimension-slider-group">
                <Sliders size={13} />
                <span>4D SCALE</span>
                <input
                  type="range"
                  min="0.65"
                  max="1.35"
                  step="0.05"
                  value={slice}
                  onChange={(e) => setSlice(parseFloat(e.target.value))}
                  className="dimension-slider"
                  aria-label="Dimensional Scale Slider"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Haute Couture Product Editorial */}
          <div className="inspector-info">
            <div className="inspector-meta-header">
              <span className="epoch-badge">{product.chronoEpoch}</span>
              <button
                className={`wishlist-icon-btn ${isWishlisted ? "wishlisted" : ""}`}
                onClick={() => {
                  sound.playClick();
                  onToggleWishlist(product.id);
                }}
                aria-label="Wishlist toggle"
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <h2 className="inspector-title">{product.name}</h2>
            <div className="inspector-price-row">
              <span className="inspector-price">${product.price}.00 USD</span>
              <span className="inspector-tag-pill">{product.tag || "LIMITED RELEASE"}</span>
            </div>

            <p className="inspector-desc">{product.description}</p>

            {/* Specifications Matrix */}
            <div className="specs-section">
              <span className="section-title">4D SPECIFICATIONS</span>
              <div className="specs-grid">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="spec-item">
                    <Check size={13} className="spec-check" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Finish Detail */}
            <div className="finish-box">
              <Sparkles size={16} className="finish-icon" />
              <div>
                <strong>{product.materialFinish}</strong>
                <p>Constructed in our zero-gravity kinetic design studio.</p>
              </div>
            </div>

            {/* Quantity and Add to Bag */}
            <div className="inspector-actions">
              <div className="quantity-selector">
                <button
                  onClick={() => {
                    sound.playClick();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setQuantity(quantity + 1);
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className="add-bag-primary"
                onClick={() => {
                  sound.playAddBag();
                  onAddToCart(product, quantity);
                  onClose();
                }}
              >
                <ShoppingBag size={17} />
                <span>ADD TO BAG — ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>

            <p className="inspector-footnote">
              ✦ Includes lifetime hyper-spatial authenticity certificate & volumetric packaging.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
