import { useState, useEffect, useRef } from "react";

type KarmaBarProps = {
  karma: number;
  onNirvana?: () => void;
};

type FloatingText = { id: number; amount: number };

export function KarmaBar({ karma, onNirvana }: KarmaBarProps) {
  const maxKarma = 100;
  const percent = Math.min(karma, maxKarma);
  const isMax = percent >= 100;

  const prevKarma = useRef(karma);
  const [floats, setFloats] = useState<FloatingText[]>([]);
  const floatId = useRef(0);

  useEffect(() => {
    const diff = karma - prevKarma.current;
    prevKarma.current = karma;
    if (diff > 0) {
      const id = floatId.current++;
      setFloats(prev => [...prev, { id, amount: diff }]);
      setTimeout(() => {
        setFloats(prev => prev.filter(f => f.id !== id));
      }, 1500);
    }
  }, [karma]);

  return (
    <div style={{
      position: "absolute",
      top: 20, right: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 6,
      zIndex: 1000,
      transition: "all 0.5s ease",
    }}>
      {/* Bar container */}
      <div style={{
        width: isMax ? 280 : 200,
        height: isMax ? 28 : 20,
        backgroundColor: "#222",
        border: isMax ? "4px solid #00ff88" : "3px solid #555",
        borderRadius: 2,
        overflow: "hidden",
        imageRendering: "pixelated",
        boxShadow: isMax ? "0 0 24px #00ff88, 0 0 60px #00ff88aa" : "none",
        animation: isMax ? "karma-glow 1s ease-in-out infinite alternate" : "none",
        transition: "width 0.5s ease, height 0.5s ease",
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
        fontSize: isMax ? 16 : 12,
        fontFamily: "'Press Start 2P', monospace",
        letterSpacing: isMax ? 3 : 1,
        textShadow: isMax ? "0 0 16px #00ff88, 0 0 40px #00ff88aa, 2px 2px #000" : "2px 2px #000",
        imageRendering: "pixelated",
        WebkitFontSmoothing: "none",
        animation: isMax ? "karma-glow 1s ease-in-out infinite alternate" : "none",
        transition: "font-size 0.5s ease",
      }}>
        {isMax ? "☸ KARMA 100/100 ☸" : `KARMA ${percent}/100`}
      </div>

      {/* Nirvana button — only at 100 */}
      {isMax && (
        <button
          onClick={onNirvana}
          style={{
            marginTop: 12,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 11,
            color: "#000",
            background: "#00ff88",
            border: "none",
            padding: "12px 24px",
            cursor: "pointer",
            letterSpacing: 2,
            boxShadow: "6px 6px 0 #007744, 0 0 24px #00ff88aa",
            animation: "nirvana-btn-pulse 0.8s ease-in-out infinite alternate",
            whiteSpace: "nowrap",
          }}
        >
          ☸ TIME FOR NIRVANA
        </button>
      )}

      {/* Floating karma gain text */}
      {floats.map(f => (
        <div key={f.id} style={{
          position: "absolute",
          top: 20,
          right: 230,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 20,
          color: "#00ff88",
          textShadow: "0 0 12px #00ff88, 0 0 24px #00ff88aa, 2px 2px 0 #000",
          animation: "karma-float 1.5s ease-out forwards",
          pointerEvents: "none",
          zIndex: 1001,
        }}>
          +{f.amount}
        </div>
      ))}

      <style>{`
        @keyframes karma-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-30px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
        }
        @keyframes karma-glow {
          from { box-shadow: 0 0 16px #00ff88, 0 0 40px #00ff88aa; }
          to   { box-shadow: 0 0 30px #00ff88, 0 0 80px #00ff88cc; }
        }
        @keyframes karma-fill-pulse {
          from { opacity: 0.85; }
          to   { opacity: 1; }
        }
        @keyframes nirvana-btn-pulse {
          from { transform: scale(1);    box-shadow: 6px 6px 0 #007744, 0 0 20px #00ff88aa; }
          to   { transform: scale(1.08); box-shadow: 6px 6px 0 #007744, 0 0 40px #00ff88ff; }
        }
      `}</style>
    </div>
  );
}
