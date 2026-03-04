import { useState, useEffect, useRef } from "react";

type MeditationMinigameProps = {
  onComplete: (karma: number) => void;
  onClose: () => void;
};

const KARMA_REWARD = 20;
const TOTAL_BEADS = 9;
const BEAT_MS = 1400; // how long each bead pulses before timing out

export function MeditationMinigame({ onComplete, onClose }: MeditationMinigameProps) {
  const [phase, setPhase] = useState<"idle" | "playing" | "complete">("idle");
  const [activeBead, setActiveBead] = useState<number | null>(null);
  const [beadsDone, setBeadsDone] = useState(0);
  const [hits, setHits] = useState(0);
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);
  const [finalMsg, setFinalMsg] = useState("");

  const activeBeadRef = useRef<number | null>(null);
  const beadsDoneRef = useRef(0);
  const hitsRef = useRef(0);
  activeBeadRef.current = activeBead;
  beadsDoneRef.current = beadsDone;
  hitsRef.current = hits;

  // Advance to next bead on a timer
  useEffect(() => {
    if (phase !== "playing") return;
    if (beadsDone >= TOTAL_BEADS) return;

    // Pick a new bead position (0-8 around a circle)
    const next = Math.floor(Math.random() * TOTAL_BEADS);
    setActiveBead(next);

    const timeout = setTimeout(() => {
      // Missed — bead expired
      if (activeBeadRef.current === next) {
        setActiveBead(null);
        triggerFlash("miss");
        advance();
      }
    }, BEAT_MS);

    return () => clearTimeout(timeout);
  }, [phase, beadsDone]);

  function triggerFlash(type: "hit" | "miss") {
    setFlash(type);
    setTimeout(() => setFlash(null), 300);
  }

  function advance() {
    const next = beadsDoneRef.current + 1;
    beadsDoneRef.current = next;
    setBeadsDone(next);
    if (next >= TOTAL_BEADS) {
      finishGame();
    }
  }

  function handleBeadClick(index: number) {
    if (phase !== "playing") return;
    if (activeBeadRef.current !== index) return;

    setActiveBead(null);
    hitsRef.current += 1;
    setHits(h => h + 1);
    triggerFlash("hit");
    advance();
  }

  function finishGame() {
    const h = hitsRef.current;
    const msg =
      h === TOTAL_BEADS ? "Every bead touched with perfect presence. ☸️" :
      h >= 6            ? "The mind was mostly still. The mantra carried you." :
      h >= 3            ? "Distraction is natural. The practice continues." :
                          "The mind wanders. That is why we practice.";
    setFinalMsg(msg);
    setActiveBead(null);
    setPhase("complete");
  }

  function startGame() {
    setBeadsDone(0);
    beadsDoneRef.current = 0;
    setHits(0);
    hitsRef.current = 0;
    setActiveBead(null);
    setFlash(null);
    setPhase("playing");
  }

  // Bead positions around a circle
  const RADIUS = 100;
  const CENTER = 130;
  const beadPositions = Array.from({ length: TOTAL_BEADS }).map((_, i) => {
    const angle = (i / TOTAL_BEADS) * Math.PI * 2 - Math.PI / 2;
    return {
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  });

  const bgFlash =
    flash === "hit"  ? "rgba(136,238,187,0.18)" :
    flash === "miss" ? "rgba(255,100,80,0.18)"  : "#07080f";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(3px)",
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <div style={{
        background: bgFlash,
        border: `3px solid ${flash === "hit" ? "#88eebb" : flash === "miss" ? "#ff6655" : "#2a2a5a"}`,
        boxShadow: "8px 8px 0 #000",
        padding: "40px 48px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        minWidth: 380,
        transition: "background 0.15s, border-color 0.15s",
      }}>

        <div style={{ fontSize: 12, color: "#aaaaff", letterSpacing: 2, textShadow: "2px 2px #000" }}>
          ☸ MANTRA BEADS
        </div>

        {phase === "idle" && (
          <>
            <div style={{ fontSize: 9, color: "#7799bb", lineHeight: 2.4, textAlign: "center", maxWidth: 300 }}>
              A glowing bead will appear.<br />
              Click it before it fades.<br />
              Stay present — {TOTAL_BEADS} beads to complete.<br /><br />
              <span style={{ color: "#aaaaff" }}>+{KARMA_REWARD} KARMA</span> for completing.
            </div>
            <button onClick={startGame} style={btn("#aaaaff", "#222255", "#000")}>▶ BEGIN</button>
            <button onClick={onClose} style={btn("#333", "#111", "#aaa")}>BACK</button>
          </>
        )}

        {phase === "playing" && (
          <>
            <div style={{ fontSize: 9, color: "#446688", letterSpacing: 2 }}>
              {beadsDone} / {TOTAL_BEADS} ·{" "}
              <span style={{ color: "#88eebb" }}>{hits} HIT</span>
            </div>

            {/* Mala bead circle */}
            <div style={{
              position: "relative",
              width: CENTER * 2,
              height: CENTER * 2,
            }}>
              {/* Center symbol */}
              <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 28,
                color: flash === "hit" ? "#88eebb" : flash === "miss" ? "#ff6655" : "#334466",
                transition: "color 0.15s",
                userSelect: "none",
              }}>
                ☸
              </div>

              {/* Thread circle */}
              <div style={{
                position: "absolute",
                top: CENTER - RADIUS,
                left: CENTER - RADIUS,
                width: RADIUS * 2,
                height: RADIUS * 2,
                borderRadius: "50%",
                border: "1px solid #1a1a3a",
              }} />

              {/* Beads */}
              {beadPositions.map((pos, i) => {
                const isActive = activeBead === i;
                return (
                  <div
                    key={i}
                    onClick={() => handleBeadClick(i)}
                    style={{
                      position: "absolute",
                      left: pos.x - 14,
                      top: pos.y - 14,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isActive ? "#aaaaff" : "#0d0d2a",
                      border: isActive ? "3px solid #ffffff" : "2px solid #2a2a5a",
                      boxShadow: isActive ? "0 0 16px #aaaaff, 0 0 32px #aaaaff66" : "none",
                      cursor: isActive ? "pointer" : "default",
                      transition: "all 0.1s",
                      animation: isActive ? "bead-pulse 0.4s ease-in-out infinite alternate" : "none",
                    }}
                  />
                );
              })}
            </div>

            <div style={{ fontSize: 8, color: "#334466", letterSpacing: 1 }}>
              CLICK THE GLOWING BEAD
            </div>
          </>
        )}

        {phase === "complete" && (
          <>
            <div style={{ fontSize: 9, color: "#aaaaff", lineHeight: 2.4, textAlign: "center", maxWidth: 300 }}>
              {finalMsg}
            </div>
            <div style={{ fontSize: 9, color: "#ffdd55", letterSpacing: 2 }}>
              +{KARMA_REWARD} KARMA EARNED
            </div>
            <button onClick={() => onComplete(KARMA_REWARD)} style={btn("#ffdd55", "#aa8800", "#000")}>
              CLAIM KARMA
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes bead-pulse {
          from { transform: scale(1); }
          to   { transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}

function btn(bg: string, shadow: string, color: string): React.CSSProperties {
  return {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 11, color, background: bg, border: "none",
    padding: "12px 28px", cursor: "pointer", letterSpacing: 2,
    boxShadow: `4px 4px 0 ${shadow}, 0 0 0 2px #000`,
  };
}
