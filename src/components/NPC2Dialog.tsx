import { useState } from "react";

type NPC2DialogProps = {
  onClose: () => void;
  onKarma: () => void;
};

const QUESTIONS = [
  {
    question: "What do you know about Buddhism?",
    responses: [
      "The Buddha taught that suffering arises from attachment. In a city like this, with so much to want — that teaching feels very relevant.",
      "At its heart, Buddhism is about waking up. Not metaphorically — actually seeing reality clearly, without the fog of craving and aversion.",
    ]
  },
  {
    question: "How do you think Buddhism fits in Norway?",
    responses: [
      "Interestingly well. Norwegians value stillness, nature, and inward reflection. The Buddhist path does not clash with that — it deepens it.",
      "There is a long tradition of Buddhist communities here. People from all walks of life find something in it — whether they call themselves Buddhist or not.",
    ]
  },
  {
    question: "What is the hardest part of the Buddhist path?",
    responses: [
      "Consistency. Sitting still once brings peace. Sitting still every day, for years — that is where transformation happens.",
      "Letting go of the idea that you are a fixed self. The Buddha called this anatta — no-self. Most people find that terrifying at first.",
    ]
  }
];

export function NPC2Dialog({ onClose, onKarma }: NPC2DialogProps) {
  const [response, setResponse] = useState<string | null>(null);

  function handleSelect(i: number) {
    const pool = QUESTIONS[i].responses;
    setResponse(pool[Math.floor(Math.random() * pool.length)]);
    onKarma();
  }

  return (
    <div style={{
      position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.88)", color: "white", padding: "24px",
      border: "2px solid #334466", boxShadow: "6px 6px 0 #000",
      width: "620px", fontFamily: "'Press Start 2P', monospace",
      fontSize: "11px", lineHeight: 2, zIndex: 10,
    }}>
      <div style={{ fontSize: 9, color: "#7799bb", letterSpacing: 2, marginBottom: 12, borderBottom: "1px solid #1a2a44", paddingBottom: 8 }}>
        ☸ PHILOSOPHER
      </div>
      <div style={{ marginBottom: "16px", fontSize: 10, color: "#ccddff", lineHeight: 2.2 }}>
        {response ?? "I have a moment. What is on your mind?"}
      </div>
      {!response && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => handleSelect(i)} style={optionBtn}>
              › {q.question}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        {response && <button onClick={() => setResponse(null)} style={smallBtn}>← BACK</button>}
        <button onClick={onClose} style={{ ...smallBtn, marginLeft: "auto" }}>CLOSE ✕</button>
      </div>
    </div>
  );
}

const optionBtn: React.CSSProperties = {
  display: "block", width: "100%", padding: "10px 14px",
  background: "#0d1a2e", color: "#aabbdd", border: "1px solid #334466",
  cursor: "pointer", fontFamily: "'Press Start 2P', monospace",
  fontSize: 9, textAlign: "left", letterSpacing: 1, lineHeight: 1.8,
};
const smallBtn: React.CSSProperties = {
  padding: "6px 12px", background: "#0d1a2e", color: "#7799bb",
  border: "1px solid #334466", cursor: "pointer",
  fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: 1,
};
