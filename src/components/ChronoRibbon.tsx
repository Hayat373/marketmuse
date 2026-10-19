import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ChronoRibbonProps {
  speed?: number;
  colorScheme?: "titanium" | "quantum" | "aurora" | "obsidian";
  onCoordUpdate?: (coords: [number, number, number, number]) => void;
}

export function ChronoRibbon({
  speed = 1,
  colorScheme = "quantum",
  onCoordUpdate,
}: ChronoRibbonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const segments = 220;
  const sides = 14;

  const { initialPositions, indices, paletteColors } = useMemo(() => {
    const pos: number[] = [];
    const idx: number[] = [];

    let colorList: [number, number, number][];
    switch (colorScheme) {
      case "titanium":
        colorList = [
          [0.85, 0.72, 0.58],
          [0.92, 0.85, 0.76],
          [0.68, 0.54, 0.42],
          [0.98, 0.94, 0.88],
        ];
        break;
      case "aurora":
        colorList = [
          [0.06, 0.72, 0.51],
          [0.55, 0.36, 0.96],
          [0.02, 0.71, 0.83],
          [0.93, 0.28, 0.6],
        ];
        break;
      case "obsidian":
        colorList = [
          [0.96, 0.62, 0.04],
          [0.94, 0.27, 0.27],
          [0.18, 0.18, 0.22],
          [0.82, 0.82, 0.85],
        ];
        break;
      case "quantum":
      default:
        colorList = [
          [0.22, 0.74, 0.97],
          [0.75, 0.52, 0.99],
          [0.96, 0.25, 0.37],
          [0.34, 0.85, 0.78],
        ];
        break;
    }

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const theta = t * Math.PI * 4;
      const x = (t - 0.5) * 11.5;
      const y = Math.sin(theta) * 1.2;
      const z = Math.cos(theta * 0.75) * 0.9;
      const radius = 0.25 + 0.38 * Math.sin(t * Math.PI * 3);

      for (let j = 0; j <= sides; j++) {
        const phi = (j / sides) * Math.PI * 2;
        const py = y + Math.sin(phi) * radius;
        const pz = z + Math.cos(phi) * radius;
        pos.push(x, py, pz);
      }

      if (i < segments) {
        for (let j = 0; j <= sides; j++) {
          const a = i * (sides + 1) + j;
          const b = a + sides + 1;
          idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    }

    return {
      initialPositions: new Float32Array(pos),
      indices: new Uint32Array(idx),
      paletteColors: colorList,
    };
  }, [colorScheme]);

  const dynamicPositions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);
  const dynamicColors = useMemo(() => new Float32Array(initialPositions.length), [initialPositions.length]);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime() * 0.6 * speed;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    const colAttr = geo.attributes.color;

    let pIdx = 0;
    let cIdx = 0;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const wave4D = Math.sin(time * 1.5 + t * 9.0) * 0.35 + Math.cos(time * 0.8 + t * 4.5) * 0.2;
      const envelope = 0.6 + 1.2 * Math.exp(-Math.pow((t - 0.5) * 4.5, 2));

      const mouseDist = (t - 0.5) * 4.0 - pointer.x * 2.0;
      const mouseInfluence = Math.exp(-mouseDist * mouseDist * 3.0) * pointer.y * 0.6;

      const baseX = (t - 0.5) * 11.5;
      const baseY = Math.sin(t * Math.PI * 4 + time * 0.7) * (1.1 + wave4D) + mouseInfluence;
      const baseZ = Math.cos(t * Math.PI * 3 + time * 0.9) * (0.8 + wave4D * 0.5);
      const width = (0.28 + 0.42 * Math.sin(t * 16.0 + time)) * envelope;

      const paletteIdx = Math.floor(t * (paletteColors.length - 1));
      const nextPaletteIdx = Math.min(paletteIdx + 1, paletteColors.length - 1);
      const frac = (t * (paletteColors.length - 1)) % 1;
      const c1 = paletteColors[paletteIdx];
      const c2 = paletteColors[nextPaletteIdx];

      for (let j = 0; j <= sides; j++) {
        const phi = (j / sides) * Math.PI * 2;
        const py = baseY + Math.sin(phi + time * 0.4) * width;
        const pz = baseZ + Math.cos(phi + time * 0.4) * width * 0.6;

        dynamicPositions[pIdx++] = baseX;
        dynamicPositions[pIdx++] = py;
        dynamicPositions[pIdx++] = pz;

        const mix = (Math.sin(phi * 2.0 + t * 12.0 + time * 1.5) + 1) / 2;
        const r = THREE.MathUtils.lerp(c1[0], c2[0], frac) * (0.8 + 0.3 * mix);
        const g = THREE.MathUtils.lerp(c1[1], c2[1], frac) * (0.8 + 0.3 * mix);
        const b = THREE.MathUtils.lerp(c1[2], c2[2], frac) * (0.8 + 0.3 * mix);

        dynamicColors[cIdx++] = r;
        dynamicColors[cIdx++] = g;
        dynamicColors[cIdx++] = b;
      }
    }

    if (posAttr && "array" in posAttr) {
      (posAttr.array as Float32Array).set(dynamicPositions);
      posAttr.needsUpdate = true;
    }
    if (colAttr && "array" in colAttr) {
      (colAttr.array as Float32Array).set(dynamicColors);
      colAttr.needsUpdate = true;
    }
    geo.computeVertexNormals();

    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.15;
    meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.08;

    if (onCoordUpdate && Math.floor(time * 10) % 4 === 0) {
      onCoordUpdate([
        Number(dynamicPositions[100].toFixed(2)),
        Number(dynamicPositions[101].toFixed(2)),
        Number(dynamicPositions[102].toFixed(2)),
        Number(Math.sin(time * 1.2).toFixed(2)),
      ]);
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.04, -0.12, -0.08]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[dynamicPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[dynamicColors, 3]} />
        <bufferAttribute attach="index" args={[indices, 1]} />
      </bufferGeometry>
      <meshPhysicalMaterial
        vertexColors
        side={THREE.DoubleSide}
        roughness={0.22}
        metalness={0.35}
        clearcoat={0.95}
        clearcoatRoughness={0.12}
        transmission={0.25}
        reflectivity={0.9}
      />
    </mesh>
  );
}
