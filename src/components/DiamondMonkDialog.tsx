import { useState } from "react";
import { dimMusic, muteMusic } from "../bgMusic";

type DiamondMonkDialogProps = {
  onClose: () => void;
  onMeditationMinigame: () => void;
};

const DIAMOND_QUESTIONS: {
  question: string;
  video: string | null;
  response: string;
}[] = [
  {
    question: "What is Diamond Way Buddhism?",
    video: "/sprites/munk/diamondway1.mp4",
    response: "",
  },
  {
    question: "What is the Diamondway center here in Trondheim?",
    video: "/sprites/munk/diamondway2.mp4",
    response: "",
  },
  {
    question: "How do you meditate in the Diamond Way tradition?",
    video: null,
    response:
      "We sit quietly and visualize a Buddha form above us — radiant, peaceful, vast. We recite mantra, let the image dissolve into light, and rest in that open awareness. It is simple, but very powerful. The mind recognizes its own nature.",
  },
];

export function DiamondMonkDialog({ onClose, onMeditationMinigame }: DiamondMonkDialogProps) {
  const [response, setResponse] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");

  function handleSelect(index: number) {
    const q = DIAMOND_QUESTIONS[index];
    if (q.video) {
      setVideoSrc(q.video);
      setShowVideo(true);
      muteMusic();
    } else {
      setResponse(q.response);
    }
  }

  function handleVideoEnded() {
    setShowVideo(false);
    dimMusic();
  }

  function handleBack() {
    setResponse(null);
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
            border: "3px solid #2244aa",
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
      border: "2px solid #2255cc",
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
        color: "#88aaff",
        letterSpacing: 2,
        marginBottom: 12,
        borderBottom: "1px solid #112266",
        paddingBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <img
          src="/sprites/monk_d.png"
          style={{ width: 28, height: 28, imageRendering: "pixelated" }}
        />
        ◆ DIAMOND WAY TEACHER
      </div>

      {/* Body */}
      <div style={{ marginBottom: "16px", fontSize: 10, color: "#ccd8ff", lineHeight: 2.2 }}>
        {response ? response : "Welcome. What would you like to know about Diamond Way?"}
      </div>

      {/* Questions */}
      {!response && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DIAMOND_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => handleSelect(i)} style={optionBtn}>
              › {q.question}
            </button>
          ))}
          <button onClick={onMeditationMinigame} style={{ ...optionBtn, borderColor: "#55aaff", color: "#55aaff" }}>
            ☸ Meditate together (+20 karma)
          </button>
        </div>
      )}

      {/* Back / Close */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        {response && (
          <button onClick={handleBack} style={smallBtn}>
            ← BACK
          </button>
        )}
        <button onClick={onClose} style={{ ...smallBtn, marginLeft: "auto" }}>
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
  background: "#00081a",
  color: "#ccd8ff",
  border: "1px solid #2255cc",
  cursor: "pointer",
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 9,
  textAlign: "left",
  letterSpacing: 1,
  lineHeight: 1.8,
};

const smallBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#00081a",
  color: "#4466aa",
  border: "1px solid #2255cc",
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
