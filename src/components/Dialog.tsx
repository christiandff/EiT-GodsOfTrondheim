type DialogProps = {
  questionSelected: number | null;
  onSelect: (index: number) => void;
  onClose: () => void;
  response: string | null;
  onBack: () => void;
};

export function Dialog({ questionSelected, onSelect, onClose, response, onBack }: DialogProps) {
  const questions = [
    "What do you know about Buddhism?",
    "How do you think a Buddhist lives in Trondheim?"
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "20px",
        border: "2px solid white",
        width: "600px",
        fontFamily: "monospace",
        fontSize: "18px",
        zIndex: 10
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        {response
          ? response
          : "Choose a question to ask:"}
      </div>

      {!response &&
        questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              display: "block",
              margin: "8px 0",
              padding: "8px 12px",
              background: "#444",
              color: "white",
              border: "1px solid white",
              cursor: "pointer"
            }}
          >
            {q}
          </button>
        ))}

      {response && (
        <button
          onClick={onBack}
          style={{
            marginTop: "12px",
            padding: "6px 10px",
            background: "#333",
            color: "white",
            border: "1px solid white",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Back
        </button>
      )}

      <button
        onClick={onClose}
        style={{
          marginTop: "12px",
          padding: "6px 10px",
          background: "#222",
          color: "white",
          border: "1px solid white",
          float: "right",
          cursor: "pointer"
        }}
      >
        X
      </button>
    </div>
  );
}
