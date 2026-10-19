import { motion } from "framer-motion";
import { Clock, Cpu, Gauge, Radio } from "lucide-react";
import type { ColorEpoch, DimensionMode } from "./DimensionCanvas";
import { sound } from "../audio/soundEngine";

interface ChronoTimelineProps {
  epoch: ColorEpoch;
  onEpochChange: (epoch: ColorEpoch) => void;
  mode: DimensionMode;
  onModeChange: (mode: DimensionMode) => void;
  warpSpeed: number;
  onWarpSpeedChange: (speed: number) => void;
  coords: [number, number, number, number];
}

const EPOCHS: { id: ColorEpoch; label: string; period: string; color: string }[] = [
  { id: "titanium", label: "TITANIUM DAWN", period: "T-01", color: "#d5b38d" },
  { id: "quantum", label: "QUANTUM NOON", period: "T-02", color: "#38bdf8" },
  { id: "aurora", label: "CYBER AURORA", period: "T-03", color: "#10b981" },
  { id: "obsidian", label: "SINGULARITY VOID", period: "T-04", color: "#f59e0b" },
];

const MODES: { id: DimensionMode; label: string; icon: string }[] = [
  { id: "wave", label: "KINETIC WAVE", icon: "〰" },
  { id: "tesseract", label: "4D TESSERACT", icon: "❖" },
  { id: "singularity", label: "QUANTUM FLUX", icon: "⚬" },
];

export function ChronoTimeline({
  epoch,
  onEpochChange,
  mode,
  onModeChange,
  warpSpeed,
  onWarpSpeedChange,
  coords,
}: ChronoTimelineProps) {
  return (
    <div className="chrono-timeline-bar">
      {/* Top Row: Epoch Tabs */}
      <div className="timeline-epochs">
        <div className="timeline-title-tag">
          <Clock size={13} />
          <span>CHRONO DIMENSION:</span>
        </div>

        <div className="epoch-pill-group">
          {EPOCHS.map((ep) => {
            const isActive = epoch === ep.id;
            return (
              <button
                key={ep.id}
                className={`epoch-tab ${isActive ? "epoch-active" : ""}`}
                onClick={() => {
                  sound.playWarp();
                  onEpochChange(ep.id);
                }}
                onMouseEnter={() => sound.playHover()}
              >
                <span className="epoch-period" style={{ color: ep.color }}>
                  {ep.period}
                </span>
                <span className="epoch-name">{ep.label}</span>
                {isActive && (
                  <motion.div
                    className="epoch-indicator"
                    layoutId="epochIndicator"
                    style={{ background: ep.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Row: Geometry Mode & Warp Speed & Live 4D Telemetry */}
      <div className="timeline-controls-row">
        {/* Geometry Mode Select */}
        <div className="geometry-mode-group">
          <span className="control-label">
            <Cpu size={12} /> PROJECTION:
          </span>
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`mode-btn ${mode === m.id ? "mode-active" : ""}`}
              onClick={() => {
                sound.playClick();
                onModeChange(m.id);
              }}
              onMouseEnter={() => sound.playHover()}
            >
              <span className="mode-glyph">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Live 4D Coordinates HUD */}
        <div className="telemetry-hud">
          <div className="telemetry-indicator">
            <Radio size={12} className="telemetry-live-icon" />
            <span>ℝ⁴ HYPERSPACE:</span>
          </div>
          <div className="telemetry-values">
            <span>X: <i>{coords[0] >= 0 ? `+${coords[0]}` : coords[0]}</i></span>
            <span>Y: <i>{coords[1] >= 0 ? `+${coords[1]}` : coords[1]}</i></span>
            <span>Z: <i>{coords[2] >= 0 ? `+${coords[2]}` : coords[2]}</i></span>
            <span className="w-active">W: <i>{coords[3] >= 0 ? `+${coords[3]}` : coords[3]}</i></span>
          </div>
        </div>

        {/* Warp Velocity Multiplier */}
        <div className="warp-speed-group">
          <span className="control-label">
            <Gauge size={12} /> WARP:
          </span>
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              className={`speed-btn ${warpSpeed === s ? "speed-active" : ""}`}
              onClick={() => {
                sound.playClick();
                onWarpSpeedChange(s);
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
