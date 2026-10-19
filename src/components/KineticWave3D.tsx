import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { products } from "../data/products";
import { sound } from "../audio/soundEngine";

export type WaveMaterialMode = "prismatic" | "silk_gold" | "obsidian";

interface KineticWave3DProps {
  speed?: number;
  materialMode?: WaveMaterialMode;
  onCoordUpdate?: (coords: [number, number, number, number]) => void;
  onCardClick?: (productIndex: number) => void;
}

const CARD_COUNT = 46;

// Palettes:
const PRISMATIC_STOPS: [number, number, number][] = [
  [0.42, 0.14, 0.27], // Deep Wine #6b2444
  [0.28, 0.18, 0.42], // Deep Indigo #472e6b
  [0.17, 0.32, 0.52], // Slate Blue #2b5285
  [0.18, 0.58, 0.68], // Electric Cyan #2e94ad
  [0.89, 0.32, 0.56], // Hot Magenta #e3528f
  [0.94, 0.48, 0.42], // Coral Peach #f07a6b
  [0.55, 0.22, 0.58], // Deep Violet #8c3894
];

const SILK_GOLD_STOPS: [number, number, number][] = [
  [0.85, 0.72, 0.58], // Warm Camel
  [0.96, 0.90, 0.82], // Ethereal Ivory
  [0.78, 0.62, 0.45], // Rich Gold
  [0.92, 0.85, 0.74], // Champagne Silk
  [0.65, 0.48, 0.35], // Roasted Amber
  [0.98, 0.94, 0.88], // Luminous Pearl
];

const OBSIDIAN_STOPS: [number, number, number][] = [
  [0.12, 0.12, 0.15], // Smoked Obsidian
  [0.16, 0.22, 0.30], // Deep Steel
  [0.08, 0.55, 0.65], // Neon Cyan Edge
  [0.15, 0.15, 0.18], // Pure Carbon
  [0.65, 0.20, 0.55], // Ultraviolet
  [0.10, 0.10, 0.12], // Deep Void
];

function getStopColor(t: number, stops: [number, number, number][]): THREE.Color {
  const scaled = t * (stops.length - 1);
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  const c1 = stops[idx];
  const c2 = stops[Math.min(idx + 1, stops.length - 1)];

  return new THREE.Color(
    THREE.MathUtils.lerp(c1[0], c2[0], frac),
    THREE.MathUtils.lerp(c1[1], c2[1], frac),
    THREE.MathUtils.lerp(c1[2], c2[2], frac)
  );
}

// Point cloud labels
const SCATTERED_POINTS = [
  { pos: [-4.8, 1.6, -0.2] as [number, number, number], val: "14" },
  { pos: [-3.5, -1.4, 0.5] as [number, number, number], val: "28" },
  { pos: [-2.1, 1.8, -0.4] as [number, number, number], val: "45" },
  { pos: [-0.8, -1.7, 0.3] as [number, number, number], val: "62" },
  { pos: [0.6, 2.1, -0.5] as [number, number, number], val: "78" },
  { pos: [2.2, -1.5, 0.4] as [number, number, number], val: "93" },
  { pos: [3.8, 1.7, -0.3] as [number, number, number], val: "105" },
  { pos: [4.9, -1.2, 0.2] as [number, number, number], val: "124" },
];

export function KineticWave3D({
  speed = 1,
  materialMode = "prismatic",
  onCoordUpdate,
  onCardClick,
}: KineticWave3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cardsRef = useRef<(THREE.Mesh | null)[]>([]);

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [clickRipple, setClickRipple] = useState<{ center: number; startTime: number } | null>(null);

  // Pre-calculate card gradient and associate with fashion catalog
  const cardsData = useMemo(() => {
    const stops =
      materialMode === "silk_gold"
        ? SILK_GOLD_STOPS
        : materialMode === "obsidian"
        ? OBSIDIAN_STOPS
        : PRISMATIC_STOPS;

    return Array.from({ length: CARD_COUNT }, (_, i) => {
      const t = i / (CARD_COUNT - 1);
      const color = getStopColor(t, stops);
      // Map to product catalog (6 products)
      const product = products[i % products.length];
      return { id: i, t, color, product };
    });
  }, [materialMode]);

  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime() * 0.7 * speed;

    const mouseX = pointer.x * 2.2;
    const mouseY = pointer.y * 1.5;

    cardsData.forEach(({ t }, i) => {
      const mesh = cardsRef.current[i];
      if (!mesh) return;

      const normT = (t - 0.5) * 2; // -1 to +1
      const x = normT * 6.2;

      // Primary wave + secondary harmonic
      const phase = normT * Math.PI * 2.6 + time;
      const ripple = Math.sin(phase) * 1.15;
      const waveZ = Math.cos(normT * Math.PI * 1.9 + time * 0.8) * 0.75;

      // Interactive mouse perturbation
      const distToMouse = Math.abs(x - mouseX);
      const mousePerturbation = Math.exp(-distToMouse * 0.8) * mouseY * 0.45;

      // Click shockwave ripple
      let clickImpulse = 0;
      if (clickRipple) {
        const elapsed = (clock.getElapsedTime() - clickRipple.startTime) * 12;
        const distFromClick = Math.abs(i - clickRipple.center);
        const waveFront = Math.abs(distFromClick - elapsed);
        if (waveFront < 3) {
          clickImpulse = Math.cos((waveFront / 3) * Math.PI * 0.5) * 0.6;
        }
      }

      // Hover elevation
      const isHovered = hoveredId === i;
      const hoverLift = isHovered ? 0.35 : 0;

      const y = ripple + mousePerturbation + clickImpulse + hoverLift;
      const z = waveZ + (isHovered ? 0.4 : 0);

      mesh.position.set(x, y, z);

      // Card rotations: banking, twisting along the curve
      const rotZ = Math.cos(phase) * 0.65 + normT * 0.2;
      const rotY = Math.sin(phase * 0.7) * 0.35 + pointer.x * 0.3;
      const rotX = Math.sin(normT * 3.5 + time) * 0.3 + (isHovered ? 0.2 : 0);

      mesh.rotation.set(rotX, rotY, rotZ);

      // Height modulation along the wave envelope
      const envelope = (0.85 + 0.35 * Math.sin(t * Math.PI)) * (isHovered ? 1.2 : 1);
      mesh.scale.set(isHovered ? 1.25 : 1, envelope, isHovered ? 1.15 : 1);
    });

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.08 + pointer.x * 0.1;
      groupRef.current.rotation.x = -pointer.y * 0.08;
    }

    if (onCoordUpdate && Math.floor(clock.getElapsedTime() * 10) % 4 === 0) {
      onCoordUpdate([
        Number((pointer.x * 2).toFixed(2)),
        Number((Math.sin(time) * 1.5).toFixed(2)),
        Number((Math.cos(time) * 0.8).toFixed(2)),
        Number((Math.sin(time * 1.4)).toFixed(2)),
      ]);
    }
  });

  const hoveredItem = hoveredId !== null ? cardsData[hoveredId] : null;

  return (
    <group ref={groupRef}>
      {/* 46 Sequential 3D Sliced Cards / Fins */}
      {cardsData.map(({ id, color, product }) => {
        const isHovered = hoveredId === id;
        return (
          <mesh
            key={id}
            ref={(el) => {
              cardsRef.current[id] = el;
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredId(id);
              sound.playStrum(id, CARD_COUNT);
            }}
            onPointerOut={() => {
              setHoveredId(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              sound.playInspect();
              setClickRipple({
                center: id,
                startTime: performance.now() / 1000,
              });
              onCardClick?.(product.id - 1);
            }}
          >
            <boxGeometry args={[0.13, 1.85, 0.95]} />
            <meshPhysicalMaterial
              color={color}
              emissive={isHovered ? color : "#000000"}
              emissiveIntensity={isHovered ? 0.6 : 0}
              roughness={isHovered ? 0.15 : 0.28}
              metalness={materialMode === "silk_gold" ? 0.45 : 0.15}
              clearcoat={0.9}
              clearcoatRoughness={0.12}
              reflectivity={0.95}
            />
          </mesh>
        );
      })}

      {/* Floating Holographic Fashion Tooltip over hovered card */}
      {hoveredItem && cardsRef.current[hoveredItem.id] && (
        <group position={cardsRef.current[hoveredItem.id]!.position}>
          <Html center position={[0, 1.5, 0]} distanceFactor={12} style={{ pointerEvents: "none" }}>
            <div className="wave-hologram-tooltip">
              <span className="tooltip-cat">{hoveredItem.product.category}</span>
              <strong className="tooltip-name">{hoveredItem.product.name}</strong>
              <span className="tooltip-price">${hoveredItem.product.price}.00</span>
              <span className="tooltip-cta">CLICK TO INSPECT IN 4D ↗</span>
            </div>
          </Html>
        </group>
      )}

      {/* Floating 3D Point-Cloud Coordinate Labels (like in video) */}
      {SCATTERED_POINTS.map((pt, idx) => (
        <group key={idx} position={pt.pos}>
          <Html center distanceFactor={14} style={{ pointerEvents: "none" }}>
            <span className="scattered-tag">{pt.val}</span>
          </Html>
        </group>
      ))}

      {/* Dynamic Lighting */}
      <ambientLight intensity={materialMode === "obsidian" ? 1.2 : 1.9} />
      <directionalLight position={[0, 8, 6]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-8, -4, 4]} intensity={1.2} color="#f0d5e2" />
      <pointLight position={[0, 0, 4]} intensity={16} color="#ffffff" />
    </group>
  );
}
