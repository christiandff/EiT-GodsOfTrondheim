type DialogProps = {
  questionSelected: number | null;
  onSelect: (index: number) => void;
  onClose: () => void;
  response: string | null;
  onBack: () => void;
  onMeditate: () => void;
};

export function Dialog({
  onSelect,
  onClose,
  response,
  onBack,
}: DialogProps) {
  const questions = [
    "What do you know about Buddhism?",
    "How do you think a Buddhist lives in Trondheim?"
  ];

  // ── Normal dialog ──────────────────────────────────────
  return (
    <div style={{
      position: "absolute",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.88)",
      color: "white",
      padding: "24px",
      border: "2px solid #334466",
      boxShadow: "6px 6px 0 #000",
      width: "620px",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "11px",
      lineHeight: 2,
      zIndex: 10,
    }}>
      {/* NPC header */}
      <div style={{
        fontSize: 9,
        color: "#7799bb",
        letterSpacing: 2,
        marginBottom: 12,
        borderBottom: "1px solid #1a2a44",
        paddingBottom: 8,
      }}>
        ☸ STRANGER
      </div>

      {/* Body text */}
      <div style={{ marginBottom: "16px", fontSize: 10, color: "#ccddff", lineHeight: 2.2 }}>
        {response ? response : "What would you like to ask?"}
      </div>

      {/* Question buttons */}
      {!response && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={optionBtn}
            >
              › {q}
            </button>
          ))}
        </div>
      )}

      {/* Back / Close */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        {response && (
          <button onClick={onBack} style={smallBtn}>
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
  background: "#0d1a2e",
  color: "#aabbdd",
  border: "1px solid #334466",
  cursor: "pointer",
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 9,
  textAlign: "left",
  letterSpacing: 1,
  lineHeight: 1.8,
};

const smallBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#0d1a2e",
  color: "#7799bb",
  border: "1px solid #334466",
  cursor: "pointer",
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 8,
  letterSpacing: 1,
};
