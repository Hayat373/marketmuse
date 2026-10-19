import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { KineticWave3D } from "./KineticWave3D";
import { Tesseract4D } from "./Tesseract4D";
import { ParticleSingularity } from "./ParticleSingularity";

export type DimensionMode = "wave" | "tesseract" | "singularity";
export type ColorEpoch = "titanium" | "quantum" | "aurora" | "obsidian";

interface DimensionCanvasProps {
  mode: DimensionMode;
  epoch: ColorEpoch;
  warpSpeed: number;
  onCoordUpdate?: (coords: [number, number, number, number]) => void;
  onWaveClick?: (index: number) => void;
}

export function DimensionCanvas({
  mode,
  epoch,
  warpSpeed,
  onCoordUpdate,
  onWaveClick,
}: DimensionCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 11.2], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        {mode === "wave" && (
          <Float speed={0.8 * warpSpeed} rotationIntensity={0.08} floatIntensity={0.12}>
            <KineticWave3D
              speed={warpSpeed}
              onCoordUpdate={onCoordUpdate}
              onCardClick={onWaveClick}
            />
          </Float>
        )}

        {mode === "tesseract" && (
          <Float speed={1.2 * warpSpeed} rotationIntensity={0.2} floatIntensity={0.25}>
            <Tesseract4D
              speed={warpSpeed}
              colorScheme={epoch}
              onCoordUpdate={onCoordUpdate}
            />
          </Float>
        )}

        {mode === "singularity" && (
          <Float speed={1.2 * warpSpeed} rotationIntensity={0.15} floatIntensity={0.2}>
            <ParticleSingularity
              speed={warpSpeed}
              colorScheme={epoch}
              onCoordUpdate={onCoordUpdate}
            />
          </Float>
        )}
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.35}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 2.3}
      />
    </Canvas>
  );
}
