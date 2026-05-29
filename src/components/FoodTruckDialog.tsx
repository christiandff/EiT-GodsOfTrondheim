import { useState } from "react";

type FoodTruckDialogProps = {
  onClose: () => void;
};

const QUESTIONS: { question: string; response: string }[] = [
  {
    question: "What do you associate with the word Buddhism?",
    response: "Monks, I guess? Shaved heads, orange robes. Maybe temples. I don't know much about it honestly.",
  },
  {
    question: "What do you think buddhists are like?",
    response: "Pretty calm people from what I've seen. That monk over there never seems stressed. Must be nice.",
  },
  {
    question: "Who was Buddha?",
    response: "Some wise guy from ancient India? Sat under a tree and figured life out. That's about all I know.",
  },
];

export function FoodTruckDialog({ onClose }: FoodTruckDialogProps) {
  const [response, setResponse] = useState<string | null>(null);

  function handleSelect(index: number) {
    setResponse(QUESTIONS[index].response);
  }

  function handleBack() {
    setResponse(null);
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
        {response ? response : "Yeah? What do you want?"}
      </div>

      {/* Questions */}
      {!response && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => handleSelect(i)} style={optionBtn}>
              › {q.question}
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

