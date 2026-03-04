import { useState, useEffect, useRef } from "react";

type TeaMinigameProps = {
  onComplete: (karma: number) => void;
  onClose: () => void;
};

const ROUNDS = 3;
const KARMA_REWARD = 20;
const SWEET_MIN = 0.55;
const SWEET_MAX = 0.82;
const FILL_SPEED = 0.0035;

type Result = "perfect" | "good" | "miss" | null;

export function TeaMinigame({ onComplete, onClose }: TeaMinigameProps) {
  const [phase, setPhase] = useState<"idle" | "playing" | "between" | "complete">("idle");
  const [round, setRound] = useState(0);
  const [fill, setFill] = useState(0);
  const [pouring, setPouring] = useState(false);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [scores, setScores] = useState<Result[]>([]);
  const [finalMsg, setFinalMsg] = useState("");

  const pouringRef = useRef(false);
  const fillRef = useRef(0);
  const resolvedRef = useRef(false); // prevent double-resolve per round

  pouringRef.current = pouring;
  fillRef.current = fill;

  // Key handlers
  useEffect(() => {
    if (phase !== "playing") return;
    function onDown(e: KeyboardEvent) {
      if (e.code === "Space" && !e.repeat) { e.preventDefault(); setPouring(true); }
    }
    function onUp(e: KeyboardEvent) {
      if (e.code === "Space") { e.preventDefault(); resolve(fillRef.current); }
    }
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [phase, round]);

  // Fill ticker
  useEffect(() => {
    if (phase !== "playing") return;
    resolvedRef.current = false;

    const ticker = setInterval(() => {
      if (!pouringRef.current) return;
      setFill(prev => {
        const next = prev + FILL_SPEED;
        if (next >= 1 && !resolvedRef.current) {
          resolvedRef.current = true;
          clearInterval(ticker);
          setTimeout(() => resolve(1), 0);
          return 1;
        }
        return Math.min(next, 1);
      });
    }, 16);

    return () => clearInterval(ticker);
  }, [phase, round]);

  function resolve(currentFill: number) {
    if (resolvedRef.current && currentFill < 1) return;
    resolvedRef.current = true;
    setPouring(false);

    let result: Result;
    if (currentFill >= 1) {
      result = "miss"; // overflow
    } else if (currentFill >= SWEET_MIN && currentFill <= SWEET_MAX) {
      const center = (SWEET_MIN + SWEET_MAX) / 2;
      result = Math.abs(currentFill - center) < 0.1 ? "perfect" : "good";
    } else {
      result = "miss";
    }

    setLastResult(result);
    setScores(prev => [...prev, result]);
    setPhase("between");
  }

  function nextRound() {
    const newRound = round + 1;
    if (newRound >= ROUNDS) {
      const allScores = [...scores, lastResult];
      const perfects = allScores.filter(s => s === "perfect").length;
      const goods = allScores.filter(s => s === "good").length;
      const msg =
        perfects === ROUNDS ? "A true tea master. The monk bows deeply. 🍵" :
        perfects + goods >= 2 ? "The tea was well poured. The monk smiles warmly." :
        "The spirit is willing. Stillness takes practice.";
      setFinalMsg(msg);
      setPhase("complete");
    } else {
      setRound(newRound);
      setFill(0);
      fillRef.current = 0;
      setLastResult(null);
      setPhase("playing");
    }
  }

  function startGame() {
    setRound(0);
    setScores([]);
    setFill(0);
    fillRef.current = 0;
    setLastResult(null);
    setPhase("playing");
  }

  const fillColor =
    fill >= 1              ? "#ff6655" :
    fill > SWEET_MAX       ? "#ffaa33" :
    fill >= SWEET_MIN      ? "#88eebb" : "#55aaff";

  const resultColor =
    lastResult === "perfect" ? "#88eebb" :
    lastResult === "good"    ? "#ffdd55" : "#ff6655";

  const resultText =
    lastResult === "perfect" ? "✓ PERFECT POUR" :
    lastResult === "good"    ? "✓ GOOD POUR" : "✗ SPILLED";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(3px)",
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <div style={{
        background: "#07100d",
        border: "3px solid #2a5a3a",
        boxShadow: "8px 8px 0 #000",
        padding: "40px 56px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
        minWidth: 400,
      }}>

        {/* Title */}
        <div style={{ fontSize: 12, color: "#88eebb", letterSpacing: 2, textShadow: "2px 2px #000" }}>
          🍵 TEA CEREMONY
        </div>

        {phase !== "idle" && phase !== "complete" && (
          <div style={{ fontSize: 9, color: "#446655", letterSpacing: 2 }}>
            CUP {round + 1} / {ROUNDS}
          </div>
        )}

        {/* IDLE */}
        {phase === "idle" && (
          <>
            <div style={{ fontSize: 9, color: "#7799bb", lineHeight: 2.4, textAlign: "center", maxWidth: 300 }}>
              Pour tea into the cup.<br />
              Hold <span style={{ color: "#ffdd55" }}>SPACE</span> to pour.<br />
              Release in the <span style={{ color: "#88eebb" }}>green zone</span>.<br /><br />
              Complete {ROUNDS} cups to earn<br />
              <span style={{ color: "#88eebb" }}>+{KARMA_REWARD} KARMA</span>
            </div>
            <button onClick={startGame} style={btnStyle("#88eebb", "#2a5a3a", "#000")}>▶ BEGIN</button>
            <button onClick={onClose} style={btnStyle("#333", "#111", "#aaa")}>BACK</button>
          </>
        )}

        {/* PLAYING */}
        {phase === "playing" && (
          <>
            {/* Tea cup visual */}
            <div style={{ position: "relative", width: 120, height: 160 }}>
              {/* Cup outline */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: 140, border: "3px solid #446655",
                background: "#0a1a10", overflow: "hidden",
                clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
              }}>
                {/* Sweet spot marker */}
                <div style={{
                  position: "absolute",
                  bottom: `${SWEET_MIN * 100}%`,
                  left: 0, right: 0,
                  height: `${(SWEET_MAX - SWEET_MIN) * 100}%`,
                  background: "rgba(136,238,187,0.15)",
                  borderTop: "2px dashed #88eebb88",
                  borderBottom: "2px dashed #88eebb88",
                }} />
                {/* Tea fill */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: `${fill * 100}%`,
                  background: fillColor,
                  transition: "background 0.1s",
                }} />
              </div>
              {/* Cup handle */}
              <div style={{
                position: "absolute", right: -18, bottom: 30,
                width: 18, height: 50,
                borderRight: "3px solid #446655",
                borderTop: "3px solid #446655",
                borderBottom: "3px solid #446655",
                borderRadius: "0 12px 12px 0",
              }} />
            </div>

            <div style={{ fontSize: 9, color: "#556677", letterSpacing: 1 }}>
              {pouring ? "POURING..." : "HOLD SPACE TO POUR"}
            </div>

            {/* Fill bar */}
            <div style={{ width: 240, position: "relative" }}>
              <div style={{ width: "100%", height: 12, background: "#0a1a10", border: "2px solid #2a5a3a" }}>
                <div style={{
                  width: `${fill * 100}%`, height: "100%",
                  background: fillColor, transition: "background 0.1s",
                }} />
                {/* Sweet spot overlay on bar */}
                <div style={{
                  position: "absolute", top: 0,
                  left: `${SWEET_MIN * 100}%`,
                  width: `${(SWEET_MAX - SWEET_MIN) * 100}%`,
                  height: "100%", background: "rgba(136,238,187,0.3)",
                  border: "0 2px solid #88eebb",
                  pointerEvents: "none",
                }} />
              </div>
            </div>

            {/* Score dots */}
            <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: ROUNDS }).map((_, i) => {
                const s = scores[i];
                const col = s === "perfect" ? "#88eebb" : s === "good" ? "#ffdd55" : s === "miss" ? "#ff6655" : "#1a2a20";
                return <div key={i} style={{ width: 12, height: 12, background: col, border: "2px solid #2a5a3a" }} />;
              })}
            </div>
          </>
        )}

        {/* BETWEEN ROUNDS */}
        {phase === "between" && (
          <>
            <div style={{ fontSize: 12, color: resultColor, letterSpacing: 2, textAlign: "center" }}>
              {resultText}
            </div>
            {round + 1 < ROUNDS ? (
              <button onClick={nextRound} style={btnStyle("#88eebb", "#2a5a3a", "#000")}>
                NEXT CUP →
              </button>
            ) : (
              <button onClick={nextRound} style={btnStyle("#ffdd55", "#aa8800", "#000")}>
                FINISH ✓
              </button>
            )}
          </>
        )}

        {/* COMPLETE */}
        {phase === "complete" && (
          <>
            <div style={{ fontSize: 9, color: "#88eebb", lineHeight: 2.4, textAlign: "center", maxWidth: 320 }}>
              {finalMsg}
            </div>
            <div style={{ fontSize: 9, color: "#ffdd55", letterSpacing: 2 }}>
              +{KARMA_REWARD} KARMA EARNED
            </div>
            <button onClick={() => onComplete(KARMA_REWARD)} style={btnStyle("#ffdd55", "#aa8800", "#000")}>
              CLAIM KARMA
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg: string, shadow: string, color: string): React.CSSProperties {
  return {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 11,
    color,
    background: bg,
    border: "none",
    padding: "12px 28px",
    cursor: "pointer",
    letterSpacing: 2,
    boxShadow: `4px 4px 0 ${shadow}, 0 0 0 2px #000`,
  };
}
