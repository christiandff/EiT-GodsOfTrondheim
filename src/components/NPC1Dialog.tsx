type NPC1DialogProps = {
  onClose: () => void;
  onKarma: () => void;
};

const QUESTIONS = [
  {
    question: "Do you know anything about Buddhism?",
    responses: [
      "Buddhism? My neighbour meditates every morning. Makes the weirdest sounds. I thought the pipes were broken.",
      "I tried meditating once. Fell asleep in 30 seconds. Does that count as enlightenment?",
    ]
  },
  {
    question: "Is there a Buddhist place near here?",
    responses: [
      "Yeah there's some temple up the road I think? Or maybe it's a yoga studio. Hard to tell these days.",
      "I heard there's a Diamond Way place in Trondheim. Sounds like a jewellery shop but apparently it's Buddhism.",
    ]
  },
  {
    question: "What do you think about karma?",
    responses: [
      "Karma? My ex believes in it. She's waiting for me to get what I deserve. Been waiting five years.",
      "I accidentally stepped on a pigeon last week. Been walking carefully ever since. Just in case.",
    ]
  }
];

export function NPC1Dialog({ onClose, onKarma }: NPC1DialogProps) {
  return <NPCDialogBase questions={QUESTIONS} npcName="STUDENT" onClose={onClose} onKarma={onKarma} />;
}

// ── Shared base ──────────────────────────────────────────
import { useState } from "react";

type Q = { question: string; responses: string[] };

function NPCDialogBase({ questions, npcName, onClose, onKarma }: { questions: Q[]; npcName: string; onClose: () => void; onKarma: () => void }) {
  const [response, setResponse] = useState<string | null>(null);

  function handleSelect(i: number) {
    const pool = questions[i].responses;
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
        ☸ {npcName}
      </div>
      <div style={{ marginBottom: "16px", fontSize: 10, color: "#ccddff", lineHeight: 2.2 }}>
        {response ?? "What would you like to ask?"}
      </div>
      {!response && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {questions.map((q, i) => (
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
