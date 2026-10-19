import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Tesseract4DProps {
  speed?: number;
  warp?: number;
  colorScheme?: "titanium" | "quantum" | "aurora" | "obsidian";
  onCoordUpdate?: (coords: [number, number, number, number]) => void;
}

// Generate the 16 vertices of a 4D unit hypercube: (±1, ±1, ±1, ±1)
const BASE_VERTICES_4D: [number, number, number, number][] = [];
for (let x = -1; x <= 1; x += 2) {
  for (let y = -1; y <= 1; y += 2) {
    for (let z = -1; z <= 1; z += 2) {
      for (let w = -1; w <= 1; w += 2) {
        BASE_VERTICES_4D.push([x, y, z, w]);
      }
    }
  }
}

// Identify the 32 edges: connect pairs of vertices that differ in exactly one coordinate
const EDGES_4D: [number, number][] = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    const v1 = BASE_VERTICES_4D[i];
    const v2 = BASE_VERTICES_4D[j];
    let diff = 0;
    for (let k = 0; k < 4; k++) {
      if (v1[k] !== v2[k]) diff++;
    }
    if (diff === 1) {
      EDGES_4D.push([i, j]);
    }
  }
}

export function Tesseract4D({
  speed = 1,
  warp = 1,
  colorScheme = "quantum",
  onCoordUpdate,
}: Tesseract4DProps) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const vertexGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Buffer geometries and arrays
  const linePositions = useMemo(() => new Float32Array(EDGES_4D.length * 2 * 3), []);
  const lineColors = useMemo(() => new Float32Array(EDGES_4D.length * 2 * 3), []);

  // Palette mapper based on color scheme
  const palette = useMemo(() => {
    switch (colorScheme) {
      case "titanium":
        return {
          primary: new THREE.Color("#d5b38d"),
          secondary: new THREE.Color("#e8d8c3"),
          accent: new THREE.Color("#c49f78"),
        };
      case "aurora":
        return {
          primary: new THREE.Color("#10b981"),
          secondary: new THREE.Color("#8b5cf6"),
          accent: new THREE.Color("#06b6d4"),
        };
      case "obsidian":
        return {
          primary: new THREE.Color("#f59e0b"),
          secondary: new THREE.Color("#ef4444"),
          accent: new THREE.Color("#e2e8f0"),
        };
      case "quantum":
      default:
        return {
          primary: new THREE.Color("#38bdf8"),
          secondary: new THREE.Color("#c084fc"),
          accent: new THREE.Color("#f43f5e"),
        };
    }
  }, [colorScheme]);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime() * 0.45 * speed;

    // 4D Rotation Angles across multiple hyperplanes:
    // angleXW rotates between X and W (the 4th dimension!)
    const angleXW = t * 0.85 + pointer.x * 0.8;
    // angleYZ rotates in 3D Y-Z
    const angleYZ = t * 0.65;
    // angleYW rotates between Y and W
    const angleYW = t * 0.45 * warp + pointer.y * 0.8;
    // angleXZ
    const angleXZ = t * 0.35;

    // 4D Projective Distance (camera looking from W = 2.6)
    const distance4D = 2.5 + Math.sin(t * 0.5) * 0.2;

    const projected3D: [number, number, number][] = [];
    const wValues: number[] = [];

    // Project each of the 16 4D vertices down to 3D
    for (let i = 0; i < 16; i++) {
      let [x, y, z, w] = BASE_VERTICES_4D[i];
      const scale4D = 1.35;
      x *= scale4D;
      y *= scale4D;
      z *= scale4D;
      w *= scale4D;

      // Rotation in XW plane
      const cosXW = Math.cos(angleXW);
      const sinXW = Math.sin(angleXW);
      const x1 = x * cosXW - w * sinXW;
      const w1 = x * sinXW + w * cosXW;

      // Rotation in YW plane
      const cosYW = Math.cos(angleYW);
      const sinYW = Math.sin(angleYW);
      const y1 = y * cosYW - w1 * sinYW;
      const w2 = y * sinYW + w1 * cosYW;

      // Rotation in YZ plane
      const cosYZ = Math.cos(angleYZ);
      const sinYZ = Math.sin(angleYZ);
      const y2 = y1 * cosYZ - z * sinYZ;
      const z1 = y1 * sinYZ + z * cosYZ;

      // Rotation in XZ plane
      const cosXZ = Math.cos(angleXZ);
      const sinXZ = Math.sin(angleXZ);
      const x2 = x1 * cosXZ - z1 * sinXZ;
      const z2 = x1 * sinXZ + z1 * cosXZ;

      // 4D to 3D Perspective Projection factor:
      // Objects with higher W appear enlarged and close; negative W shrink into hyperspace
      const factor = distance4D / (distance4D - w2);
      const px = x2 * factor;
      const py = y2 * factor;
      const pz = z2 * factor;

      projected3D.push([px, py, pz]);
      wValues.push(w2);
    }

    if (onCoordUpdate && Math.floor(clock.getElapsedTime() * 10) % 3 === 0) {
      onCoordUpdate([
        Number(projected3D[0][0].toFixed(2)),
        Number(projected3D[0][1].toFixed(2)),
        Number(projected3D[0][2].toFixed(2)),
        Number(wValues[0].toFixed(2)),
      ]);
    }

    // Update Line Segment positions & colors
    let pIdx = 0;
    let cIdx = 0;
    for (let e = 0; e < EDGES_4D.length; e++) {
      const [i, j] = EDGES_4D[e];
      const p1 = projected3D[i];
      const p2 = projected3D[j];
      const w1 = wValues[i];
      const w2 = wValues[j];

      // Point 1
      linePositions[pIdx++] = p1[0];
      linePositions[pIdx++] = p1[1];
      linePositions[pIdx++] = p1[2];

      // Point 2
      linePositions[pIdx++] = p2[0];
      linePositions[pIdx++] = p2[1];
      linePositions[pIdx++] = p2[2];

      // Color lerp based on 4D W coordinate
      const normW1 = (w1 + 1.5) / 3.0;
      const normW2 = (w2 + 1.5) / 3.0;

      const col1 = palette.primary.clone().lerp(palette.secondary, normW1);
      const col2 = palette.primary.clone().lerp(palette.secondary, normW2);

      lineColors[cIdx++] = col1.r;
      lineColors[cIdx++] = col1.g;
      lineColors[cIdx++] = col1.b;

      lineColors[cIdx++] = col2.r;
      lineColors[cIdx++] = col2.g;
      lineColors[cIdx++] = col2.b;
    }

    if (lineRef.current) {
      const geo = lineRef.current.geometry;
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
    }

    // Update vertex node positions
    if (vertexGroupRef.current) {
      const children = vertexGroupRef.current.children;
      for (let i = 0; i < 16 && i < children.length; i++) {
        const p = projected3D[i];
        const w = wValues[i];
        children[i].position.set(p[0], p[1], p[2]);
        // Scale vertex sphere slightly with W coordinate for depth perception
        const s = Math.max(0.04, 0.08 * (1 + w * 0.35));
        children[i].scale.set(s, s, s);
      }
    }

    // Core crystal rotation
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.008 * speed;
      coreRef.current.rotation.y += 0.012 * speed;
      coreRef.current.rotation.z += 0.005 * speed;
    }
  });

  return (
    <group>
      {/* 4D Line Wireframe */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          linewidth={2}
        />
      </lineSegments>

      {/* 16 Hypersphere Vertex Nodes */}
      <group ref={vertexGroupRef}>
        {BASE_VERTICES_4D.map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? palette.primary : palette.secondary}
              emissive={palette.accent}
              emissiveIntensity={1.8}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Central Quantum Hyper-Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshPhysicalMaterial
          color={palette.primary}
          emissive={palette.secondary}
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.4}
          transmission={0.85}
          thickness={1.2}
          ior={1.7}
          clearcoat={1}
          wireframe
        />
      </mesh>

      {/* Ambient aura glow */}
      <pointLight color={palette.primary} intensity={25} distance={10} />
      <pointLight color={palette.secondary} intensity={20} distance={10} position={[0, -2, 2]} />
    </group>
  );
}
