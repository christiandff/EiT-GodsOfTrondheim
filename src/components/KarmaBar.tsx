type KarmaBarProps = {
  karma: number;
  onNirvana?: () => void;
};

export function KarmaBar({ karma, onNirvana }: KarmaBarProps) {
  const maxKarma = 100;
  const percent = Math.min(karma, maxKarma);
  const isMax = percent >= 100;

  return (
    <div style={{
      position: "absolute",
      top: 20, right: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 6,
      zIndex: 1000,
    }}>
      {/* Bar container */}
      <div style={{
        width: 200, height: 20,
        backgroundColor: "#222",
        border: isMax ? "3px solid #00ff88" : "3px solid #555",
        borderRadius: 2,
        overflow: "hidden",
        imageRendering: "pixelated",
        boxShadow: isMax ? "0 0 12px #00ff88, 0 0 28px #00ff8866" : "none",
        animation: isMax ? "karma-glow 1s ease-in-out infinite alternate" : "none",
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          backgroundColor: isMax ? "#00ff88" : "#00cc66",
          transition: "width 0.2s steps(4)",
          imageRendering: "pixelated",
          animation: isMax ? "karma-fill-pulse 1s ease-in-out infinite alternate" : "none",
        }} />
      </div>

      {/* Label */}
      <div style={{
        color: isMax ? "#00ff88" : "white",
        fontSize: 12,
        fontFamily: "'Press Start 2P', monospace",
        letterSpacing: 1,
        textShadow: isMax ? "0 0 8px #00ff88, 2px 2px #000" : "2px 2px #000",
        imageRendering: "pixelated",
        WebkitFontSmoothing: "none",
        animation: isMax ? "karma-glow 1s ease-in-out infinite alternate" : "none",
      }}>
        KARMA {percent}/100
      </div>

      {/* Nirvana button — only at 100 */}
      {isMax && (
        <button
          onClick={onNirvana}
          style={{
            marginTop: 4,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: "#000",
            background: "#00ff88",
            border: "none",
            padding: "10px 14px",
            cursor: "pointer",
            letterSpacing: 1,
            boxShadow: "4px 4px 0 #007744, 0 0 16px #00ff88aa",
            animation: "nirvana-btn-pulse 0.8s ease-in-out infinite alternate",
            whiteSpace: "nowrap",
          }}
        >
          ☸ TIME FOR NIRVANA
        </button>
      )}

      <style>{`
        @keyframes karma-glow {
          from { box-shadow: 0 0 8px #00ff88, 0 0 20px #00ff8844; }
          to   { box-shadow: 0 0 18px #00ff88, 0 0 40px #00ff8888; }
        }
        @keyframes karma-fill-pulse {
          from { opacity: 0.85; }
          to   { opacity: 1; }
        }
        @keyframes nirvana-btn-pulse {
          from { transform: scale(1);    box-shadow: 4px 4px 0 #007744, 0 0 12px #00ff88aa; }
          to   { transform: scale(1.04); box-shadow: 4px 4px 0 #007744, 0 0 28px #00ff88ff; }
        }
      `}</style>
    </div>
  );
}
