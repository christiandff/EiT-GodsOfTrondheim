import { useState } from "react";

type DiamondMonkDialogProps = {
  onClose: () => void;
  onMeditationMinigame: () => void;
};

// Set video: to a filename (e.g. "b3.mp4") to trigger a video for that question.
const DIAMOND_QUESTIONS: {
  question: string;
  video: string | null;
  responses: string[];
}[] = [
  {
    question: "What is Diamond Way Buddhism?",
    video: null,
    responses: [
      "Diamond Way is a branch of Kagyu Tibetan Buddhism. The 'diamond' refers to the indestructible nature of the mind — clear, powerful, and unbreakable.",
      "It was brought to the West by Lama Ole Nydahl in the 1970s. We focus on active, practical methods — meditation, mantras, and direct experience rather than only study.",
    ],
  },
  {
    question: "What is the Diamondway center here in Trondheim?",
    video: null,
    responses: [
      "We are a small community, but very much alive. People from all walks of life come here — students, workers, families. The door is open to everyone who is curious.",
      "The Trondheim center is part of a global network of over 600 Diamond Way centers. We hold meditations, teachings, and retreats throughout the year.",
    ],
  },
  {
    question: "How do you meditate in the Diamond Way tradition?",
    video: null,
    responses: [
      "Our main practice is the 16th Karmapa meditation — we visualize a Buddha form, recite mantra, and rest in the open awareness that follows. It is very powerful.",
      "We use visualization, mantra, and what we call 'the view' — resting in the nature of mind. It is not about emptying the mind, but recognizing its true quality.",
    ],
  },
];

export function DiamondMonkDialog({ onClose, onMeditationMinigame }: DiamondMonkDialogProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  function handleSelect(index: number) {
    const q = DIAMOND_QUESTIONS[index];
    setSelectedIndex(index);

    if (q.video) {
      setVideoSrc(`/sprites/${q.video}`);
      setShowVideo(true);
    } else {
      const random = Math.floor(Math.random() * q.responses.length);
      setResponse(q.responses[random]);
    }
  }

  function handleVideoEnded() {
    setShowVideo(false);
    setVideoSrc(null);
    if (selectedIndex !== null) {
      const q = DIAMOND_QUESTIONS[selectedIndex];
      const random = Math.floor(Math.random() * q.responses.length);
      setResponse(q.responses[random]);
    }
  }

  function handleBack() {
    setSelectedIndex(null);
    setResponse(null);
    setShowVideo(false);
    setVideoSrc(null);
  }

  // ── Video overlay ────────────────────────────────────
  if (showVideo && videoSrc) {
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
              {q.video && <span style={{ color: "#88aaff", marginLeft: 8, fontSize: 8 }}>▶ VIDEO</span>}
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
