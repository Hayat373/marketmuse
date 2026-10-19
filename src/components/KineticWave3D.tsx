import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

interface KineticWave3DProps {
  speed?: number;
  onCoordUpdate?: (coords: [number, number, number, number]) => void;
  onCardClick?: (index: number) => void;
}

const CARD_COUNT = 46;

// The color palette from the video reference:
// Wine -> Indigo -> Deep Teal -> Electric Cyan -> Hot Pink -> Coral -> Violet
const GRADIENT_STOPS: [number, number, number][] = [
  [0.42, 0.14, 0.27], // Deep Wine #6b2444
  [0.28, 0.18, 0.42], // Deep Indigo #472e6b
  [0.17, 0.32, 0.52], // Slate Blue #2b5285
  [0.18, 0.58, 0.68], // Electric Cyan #2e94ad
  [0.89, 0.32, 0.56], // Hot Magenta #e3528f
  [0.94, 0.48, 0.42], // Coral Peach #f07a6b
  [0.55, 0.22, 0.58], // Deep Violet #8c3894
];

function getGradientColor(t: number): THREE.Color {
  const scaled = t * (GRADIENT_STOPS.length - 1);
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  const c1 = GRADIENT_STOPS[idx];
  const c2 = GRADIENT_STOPS[Math.min(idx + 1, GRADIENT_STOPS.length - 1)];

  return new THREE.Color(
    THREE.MathUtils.lerp(c1[0], c2[0], frac),
    THREE.MathUtils.lerp(c1[1], c2[1], frac),
    THREE.MathUtils.lerp(c1[2], c2[2], frac)
  );
}

// Scattered numbers floating around the wave (like in the video)
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
  onCoordUpdate,
  onCardClick,
}: KineticWave3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cardsRef = useRef<(THREE.Mesh | null)[]>([]);

  // Pre-calculate card properties
  const cardsData = useMemo(() => {
    return Array.from({ length: CARD_COUNT }, (_, i) => {
      const t = i / (CARD_COUNT - 1);
      const color = getGradientColor(t);
      return { id: i, t, color };
    });
  }, []);

  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime() * 0.7 * speed;

    // Mouse influence
    const mouseX = pointer.x * 2.2;
    const mouseY = pointer.y * 1.5;

    cardsData.forEach(({ t }, i) => {
      const mesh = cardsRef.current[i];
      if (!mesh) return;

      // Parametric 3D/4D wave equations
      const normT = (t - 0.5) * 2; // -1 to +1
      const x = normT * 6.2;

      // Primary sine wave + secondary harmonic ripple + mouse wave
      const phase = normT * Math.PI * 2.6 + time;
      const ripple = Math.sin(phase) * 1.15;
      const waveZ = Math.cos(normT * Math.PI * 1.9 + time * 0.8) * 0.75;

      // Mouse distance wave perturbation
      const distToMouse = Math.abs(x - mouseX);
      const mousePerturbation = Math.exp(-distToMouse * 0.8) * mouseY * 0.45;

      const y = ripple + mousePerturbation;
      const z = waveZ;

      mesh.position.set(x, y, z);

      // Card rotations: banking, twisting along the curve tangent
      const rotZ = Math.cos(phase) * 0.65 + normT * 0.2;
      const rotY = Math.sin(phase * 0.7) * 0.35 + pointer.x * 0.3;
      const rotX = Math.sin(normT * 3.5 + time) * 0.3;

      mesh.rotation.set(rotX, rotY, rotZ);

      // Height modulation along the wave envelope
      const envelope = 0.85 + 0.35 * Math.sin(t * Math.PI);
      mesh.scale.set(1, envelope, 1);
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

  return (
    <group ref={groupRef}>
      {/* 46 Sequential 3D Sliced Cards / Fins */}
      {cardsData.map(({ id, color }) => (
        <mesh
          key={id}
          ref={(el) => {
            cardsRef.current[id] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
            onCardClick?.(id);
          }}
        >
          {/* Rounded rectangular card slab */}
          <boxGeometry args={[0.13, 1.85, 0.95]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.28}
            metalness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
            reflectivity={0.9}
          />
        </mesh>
      ))}

      {/* Floating 3D Point-Cloud Coordinate Labels (like in video) */}
      {SCATTERED_POINTS.map((pt, idx) => (
        <group key={idx} position={pt.pos}>
          <Html center distanceFactor={14} style={{ pointerEvents: "none" }}>
            <span className="scattered-tag">{pt.val}</span>
          </Html>
        </group>
      ))}

      {/* Ambient and Key Lighting */}
      <ambientLight intensity={1.8} />
      <directionalLight position={[0, 8, 6]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-8, -4, 4]} intensity={1.2} color="#f0d5e2" />
      <pointLight position={[0, 0, 4]} intensity={18} color="#ffffff" />
    </group>
  );
}
