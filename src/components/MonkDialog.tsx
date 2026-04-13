import { useState } from "react";
import { dimMusic, muteMusic } from "../bgMusic";

type MonkDialogProps = {
  onClose: () => void;
  onTeaMinigame: () => void;
};

const MONK_QUESTIONS = [
  "What is the essence of Buddhism?",
  "How do you practice Buddhism here in Trondheim?",
  "What happens when we die? Is rebirth real?",
];

const MONK_VIDEOS = [
  "/sprites/munk/munken1.mp4",
  "/sprites/munk/munken2.mp4",
  "/sprites/munk/munken3.mp4",
];

export function MonkDialog({ onClose, onTeaMinigame }: MonkDialogProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");

  function handleSelect(index: number) {
    setVideoSrc(MONK_VIDEOS[index]);
    setShowVideo(true);
    muteMusic();
  }

  function handleVideoEnded() {
    setShowVideo(false);
    dimMusic();
  }

  function handleBack() {
    setShowVideo(false);
    dimMusic();
  }

  // ── Video overlay ────────────────────────────────────
  if (showVideo) {
    return (
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.92)",
      }}>
        <video
          src={videoSrc}
          autoPlay
          onEnded={handleVideoEnded}
          style={{
            maxWidth: "80vw",
            maxHeight: "80vh",
            border: "3px solid #886633",
            boxShadow: "8px 8px 0 #000",
          }}
        />
        <button onClick={handleVideoEnded} style={skipBtn}>
          SKIP ▶▶
        </button>
      </div>
    );
  }

  // ── Dialog ───────────────────────────────────────────
  return (
    <div style={{
      position: "absolute",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.88)",
      color: "white",
      padding: "24px",
      border: "2px solid #886633",
      boxShadow: "6px 6px 0 #000",
      width: "640px",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "11px",
      lineHeight: 2,
      zIndex: 10,
    }}>
      {/* Header */}
      <div style={{
        fontSize: 9,
        color: "#ffcc66",
        letterSpacing: 2,
        marginBottom: 12,
        borderBottom: "1px solid #553311",
        paddingBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <img
          src="/sprites/monk_idle.png"
          style={{ width: 28, height: 28, imageRendering: "pixelated" }}
        />
        ☸ THE MONK
      </div>

      {/* Body */}
      <div style={{ marginBottom: "16px", fontSize: 10, color: "#ffe8bb", lineHeight: 2.2 }}>
        Ask me what you wish to know, traveller.
      </div>

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MONK_QUESTIONS.map((q, i) => (
          <button key={i} onClick={() => handleSelect(i)} style={optionBtn}>
            › {q} <span style={{ color: "#ffcc66", marginLeft: 8, fontSize: 8 }}>▶ VIDEO</span>
          </button>
        ))}
        <button onClick={onTeaMinigame} style={{ ...optionBtn, borderColor: "#88cc88", color: "#88cc88" }}>
          🍵 Share a cup of tea (+20 karma)
        </button>
      </div>

      {/* Close */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <button onClick={onClose} style={smallBtn}>
          CLOSE ✕
        </button>
      </div>
    </div>
  );
}

const optionBtn: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px 14px",
  background: "#1a1000",
  color: "#ffe8bb",
  border: "1px solid #886633",
  cursor: "pointer",
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 9,
  textAlign: "left",
  letterSpacing: 1,
  lineHeight: 1.8,
};

const smallBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#1a1000",
  color: "#aa8844",
  border: "1px solid #886633",
  cursor: "pointer",
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 8,
  letterSpacing: 1,
};

const skipBtn: React.CSSProperties = {
  position: "absolute",
  bottom: "10%",
  right: "12%",
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 9,
  color: "#7799bb",
  background: "#0d1a2e",
  border: "1px solid #334466",
  padding: "8px 16px",
  cursor: "pointer",
  letterSpacing: 1,
};
