import { useState } from "react";

type MonkDialogProps = {
  onClose: () => void;
};

// ── Questions + responses ────────────────────────────────
// Set video: to a filename (e.g. "b2.mp4") to trigger a video for that question.
// Leave as null to use text responses only.
const MONK_QUESTIONS: {
  question: string;
  video: string | null;
  responses: string[];
}[] = [
  {
    question: "What is the essence of Buddhism?",
    video: null, // swap to e.g. "b2.mp4" when ready
    responses: [
      "The essence is the end of suffering. The Buddha taught that life brings suffering, but the path to liberation is open to all.",
      "At its heart — compassion, awareness, and letting go of attachment. Simple words, but a lifetime of practice.",
    ],
  },
  {
    question: "How do you practice Buddhism here in Trondheim?",
    video: null,
    responses: [
      "Every morning I sit in silence for one hour. The cold Norwegian air helps — it keeps the mind sharp.",
      "The city is loud, but the practice is internal. I walk slowly, breathe deeply, and try to see every person I meet with kindness.",
    ],
  },
  {
    question: "What happens when we die? Is rebirth real?",
    video: null,
    responses: [
      "The Buddha was careful here. He did not say yes or no. What matters is how you live now — that shapes everything that follows.",
      "Karma is not punishment. It is simply cause and effect. Each action plants a seed. What grows depends on how mindfully you tend the garden.",
    ],
  },
];

export function MonkDialog({ onClose }: MonkDialogProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  function handleSelect(index: number) {
    const q = MONK_QUESTIONS[index];
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
    // After video, show a text response too
    if (selectedIndex !== null) {
      const q = MONK_QUESTIONS[selectedIndex];
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
            border: "3px solid #334466",
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
        {response ? response : "Ask me what you wish to know, traveller."}
      </div>

      {/* Questions */}
      {!response && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MONK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={optionBtn}
            >
              › {q.question}
              {q.video && (
                <span style={{ color: "#ffcc66", marginLeft: 8, fontSize: 8 }}>▶ VIDEO</span>
              )}
            </button>
          ))}
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
