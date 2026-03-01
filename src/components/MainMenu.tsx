import "../styles/MenuTitle.css";


export function MainMenu({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        color: "white",
        zIndex: 20
      }}
    >
      <div className="title">Eksperter i Team</div>
      <div className="subtitle">GODS OF TRONDHEIM</div>

      <button
        onClick={onStart}
        style={{
          marginTop: "40px",
          padding: "12px 24px",
          fontSize: "20px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          border: "2px solid white",
          cursor: "pointer"
        }}
      >
        Start Game
      </button>

      <div style={{ marginTop: "20px", fontSize: "16px" }}>
        Press ENTER to start
      </div>
    </div>
  );
}
