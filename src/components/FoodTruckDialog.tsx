import { useState } from "react";
import { dimMusic, muteMusic, restoreMusic } from "../bgMusic";

type FoodTruckDialogProps = {
  onClose: () => void;
};

const QUESTIONS = [
  "What do you associate with the word Buddhism?",
  "What do you think buddhists are like?",
  "Who was Buddha?",
];

const VIDEOS = [
  "/sprites/burgerman1.mp4",
  "/sprites/burgerman2.mp4",
  "/sprites/burgerman3.mp4",
];

export function FoodTruckDialog({ onClose }: FoodTruckDialogProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");

  function handleSelect(index: number) {
    setResponse(QUESTIONS[index]);
    setVideoSrc(VIDEOS[index]);
    setShowVideo(true);
    muteMusic();
  }

  function handleVideoEnded() {
    setShowVideo(false);
    setResponse(null);
    dimMusic();
  }

  function handleBack() {
    setResponse(null);
    setShowVideo(false);
    dimMusic();
  }

  // ── Video overlay ──────────────────────────────────────
  if (showVideo) {
    return (
      <div style={{
        position: "absolute", inset: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
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
      position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.88)", color: "white", padding: "24px",
      border: "2px solid #886633", boxShadow: "6px 6px 0 #000",
      width: "620px", fontFamily: "'Press Start 2P', monospace",
      fontSize: "11px", lineHeight: 2, zIndex: 10,
    }}>
      {/* Header */}
      <div style={{
        fontSize: 9, color: "#ffcc66", letterSpacing: 2,
        marginBottom: 12, borderBottom: "1px solid #553311", paddingBottom: 8,
      }}>
        🍜 FOOD TRUCK OWNER
      </div>

      {/* Body */}
      <div style={{ marginBottom: 16, fontSize: 10, color: "#ffe8bb", lineHeight: 2.2 }}>
        {response ? "" : "Yeah? What do you want?"}
      </div>

      {/* Questions */}
      {!response && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => handleSelect(i)} style={optionBtn}>
              › {q}
            </button>
          ))}
        </div>
      )}

      {/* Back / Close */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        {response && (
          <button onClick={handleBack} style={smallBtn}>← BACK</button>
        )}
        <button onClick={onClose} style={{ ...smallBtn, marginLeft: "auto" }}>
          CLOSE ✕
        </button>
      </div>
    </div>
  );
}

const optionBtn: React.CSSProperties = {
  display: "block", width: "100%", padding: "10px 14px",
  background: "#1a1000", color: "#ffe8bb", border: "1px solid #886633",
  cursor: "pointer", fontFamily: "'Press Start 2P', monospace",
  fontSize: 9, textAlign: "left", letterSpacing: 1, lineHeight: 1.8,
};

const smallBtn: React.CSSProperties = {
  padding: "6px 12px", background: "#1a1000", color: "#aa8844",
  border: "1px solid #886633", cursor: "pointer",
  fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 1,
};

const skipBtn: React.CSSProperties = {
  position: "absolute", bottom: "10%", right: "12%",
  fontFamily: "'Press Start 2P', monospace", fontSize: 9,
  color: "#7799bb", background: "#0d1a2e", border: "1px solid #334466",
  padding: "8px 16px", cursor: "pointer", letterSpacing: 1,
};
