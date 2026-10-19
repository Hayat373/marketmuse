import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleSingularityProps {
  speed?: number;
  colorScheme?: "titanium" | "quantum" | "aurora" | "obsidian";
  onCoordUpdate?: (coords: [number, number, number, number]) => void;
}

export function ParticleSingularity({
  speed = 1,
  colorScheme = "quantum",
  onCoordUpdate,
}: ParticleSingularityProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2400;

  const [positions, initialAngles, radii, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const angles = new Float32Array(count * 2); // [phi, theta]
    const rad = new Float32Array(count);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color(
      colorScheme === "titanium"
        ? "#d5b38d"
        : colorScheme === "aurora"
        ? "#10b981"
        : colorScheme === "obsidian"
        ? "#f59e0b"
        : "#38bdf8"
    );
    const c2 = new THREE.Color(
      colorScheme === "titanium"
        ? "#f3ede3"
        : colorScheme === "aurora"
        ? "#8b5cf6"
        : colorScheme === "obsidian"
        ? "#ef4444"
        : "#c084fc"
    );

    for (let i = 0; i < count; i++) {
      // Hopf fibration distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.4 + Math.pow(Math.random(), 2) * 4.2;

      angles[i * 2] = phi;
      angles[i * 2 + 1] = theta;
      rad[i] = r;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const mixed = c1.clone().lerp(c2, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    return [pos, angles, rad, col];
  }, [colorScheme]);

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime() * 0.4 * speed;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const currentPositions = posAttr.array as Float32Array;

    const mouseX = pointer.x * 3.5;
    const mouseY = pointer.y * 3.5;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const phi = initialAngles[i * 2];
      const baseTheta = initialAngles[i * 2 + 1];
      const r = radii[i];

      // 4D hyper-torus orbital rotation
      const currentTheta = baseTheta + time * (1.2 / Math.sqrt(r)) + Math.sin(time + r) * 0.3;
      const warpZ = Math.sin(phi * 3.0 + time * 1.5) * 0.45;

      let x = r * Math.sin(phi) * Math.cos(currentTheta);
      let y = r * Math.sin(phi) * Math.sin(currentTheta) * 0.8;
      let z = r * Math.cos(phi) * 0.7 + warpZ;

      // Mouse gravitational attraction/deflection
      const dx = mouseX - x;
      const dy = mouseY - y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 9) {
        const force = (9 - distSq) / 9;
        x += dx * force * 0.15;
        y += dy * force * 0.15;
        z += Math.sin(time * 3 + i) * force * 0.3;
      }

      currentPositions[idx] = x;
      currentPositions[idx + 1] = y;
      currentPositions[idx + 2] = z;
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.15;
    pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

    if (onCoordUpdate && Math.floor(time * 10) % 5 === 0) {
      onCoordUpdate([
        Number(currentPositions[0].toFixed(2)),
        Number(currentPositions[1].toFixed(2)),
        Number(currentPositions[2].toFixed(2)),
        Number(Math.cos(time * 1.5).toFixed(2)),
      ]);
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Center Quantum Singularity Core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={colorScheme === "obsidian" ? "#1e1b4b" : "#0f172a"}
          emissive={
            colorScheme === "titanium"
              ? "#d5b38d"
              : colorScheme === "aurora"
              ? "#10b981"
              : colorScheme === "obsidian"
              ? "#ef4444"
              : "#38bdf8"
          }
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}
