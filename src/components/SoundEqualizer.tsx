import { useState } from "react";
import { VolumeX } from "lucide-react";
import { sound } from "../audio/soundEngine";

export function SoundEqualizer() {
  const [enabled, setEnabled] = useState(sound.isEnabled());

  const handleToggle = () => {
    const newState = sound.toggle();
    setEnabled(newState);
  };

  return (
    <button
      className={`sound-eq-btn ${enabled ? "eq-active" : ""}`}
      onClick={handleToggle}
      aria-label={enabled ? "Mute 4D Soundscapes" : "Enable 4D Soundscapes"}
      title={enabled ? "Mute 4D Soundscape (Synthesizer ON)" : "Unmute 4D Soundscape (Synthesizer OFF)"}
    >
      {enabled ? (
        <div className="eq-bars">
          <span className="eq-bar bar-1" />
          <span className="eq-bar bar-2" />
          <span className="eq-bar bar-3" />
          <span className="eq-bar bar-4" />
        </div>
      ) : (
        <VolumeX size={15} />
      )}
      <span className="eq-label">{enabled ? "AUDIO 4D: ON" : "AUDIO: OFF"}</span>
    </button>
  );
}
