type PauseMenuProps = {
  onResume: () => void;
};

export function PauseMenu({ onResume }: PauseMenuProps) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.65)",
      backdropFilter: "blur(2px)",
    }}>
      {/* Scanlines on pause too */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        background: "#0a0e1a",
        border: "3px solid #334466",
        boxShadow: "8px 8px 0 #000, 0 0 40px rgba(85,170,255,0.15)",
        padding: "48px 64px",
        minWidth: 360,
      }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 28,
          color: "#ffdd55",
          textShadow: "3px 3px 0 #000",
          letterSpacing: 2,
        }}>
          PAUSED
        </div>

        <div style={{
          width: "100%",
          height: 2,
          background: "linear-gradient(to right, transparent, #334466, transparent)",
        }} />

        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: "#556677",
          letterSpacing: 2,
          lineHeight: 2,
          textAlign: "center",
        }}>
          PRESS ESC TO RESUME
        </div>

        <button
          onClick={onResume}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 14,
            color: "#000",
            background: "#55aaff",
            border: "none",
            padding: "14px 32px",
            cursor: "pointer",
            letterSpacing: 2,
            boxShadow: "4px 4px 0 #1a4488, 0 0 0 2px #000",
            transition: "transform 0.08s, box-shadow 0.08s",
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.transform = "translate(-2px,-2px)";
            (e.target as HTMLButtonElement).style.boxShadow = "6px 6px 0 #1a4488, 0 0 0 2px #000";
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.transform = "";
            (e.target as HTMLButtonElement).style.boxShadow = "4px 4px 0 #1a4488, 0 0 0 2px #000";
          }}
        >
          ▶ RESUME
        </button>
      </div>
    </div>
  );
}
