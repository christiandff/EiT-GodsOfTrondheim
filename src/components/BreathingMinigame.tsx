import { useState, useEffect, useRef } from "react";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "complete";

type BreathingMinigameProps = {
  onComplete: (karma: number) => void;
  onClose: () => void;
};

const INHALE_MS = 4000;
const HOLD_MS   = 2000;
const EXHALE_MS = 4000;
const ROUNDS    = 3;
const KARMA_REWARD = 20;

// How close the player's timing needs to be (0–1 scale) to count as "good"


export function BreathingMinigame({ onComplete, onClose }: BreathingMinigameProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [progress, setProgress] = useState(0);       // 0–1 fill of current phase
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [score, setScore] = useState(0);             // how many perfect timings
  const [feedback, setFeedback] = useState<"good" | "early" | "late" | null>(null);
  const [resultMsg, setResultMsg] = useState("");

  const phaseRef      = useRef<Phase>("idle");
  const progressRef   = useRef(0);
  const spaceHeldRef  = useRef(false);
  const roundRef      = useRef(0);
  const scoreRef      = useRef(0);

  phaseRef.current    = phase;
  progressRef.current = progress;
  spaceHeldRef.current = spaceHeld;
  roundRef.current    = round;
  scoreRef.current    = score;

  // Spacebar tracking
  useEffect(() => {
    function onDown(e: KeyboardEvent) {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setSpaceHeld(true);
      }
    }
    function onUp(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        setSpaceHeld(false);
      }
    }
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  function startGame() {
    setRound(0);
    setScore(0);
    scoreRef.current = 0;
    setProgress(0);
    setFeedback(null);
    beginPhase("inhale");
  }

  function beginPhase(p: Phase) {
    setPhase(p);
    setProgress(0);
    setFeedback(null);
  }

  // Main phase timer
  useEffect(() => {
    if (phase === "idle" || phase === "complete") return;

    const duration =
      phase === "inhale" ? INHALE_MS :
      phase === "hold"   ? HOLD_MS   :
                           EXHALE_MS;

    const start = Date.now();
    let checked = false;

    const ticker = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(t);

      // ── Inhale: player must HOLD space near the end (t > 0.85)
      if (phase === "inhale" && !checked && t >= 0.85) {
        checked = true;
        if (spaceHeldRef.current) {
          setFeedback("good");
          scoreRef.current += 1;
          setScore(s => s + 1);
        } else {
          setFeedback("early");
        }
      }

      // ── Exhale: player must RELEASE space near the end (t > 0.85)
      if (phase === "exhale" && !checked && t >= 0.85) {
        checked = true;
        if (!spaceHeldRef.current) {
          setFeedback("good");
          scoreRef.current += 1;
          setScore(s => s + 1);
        } else {
          setFeedback("late");
        }
      }

      if (t >= 1) {
        clearInterval(ticker);
        const nextRound = roundRef.current;

        if (phase === "inhale") {
          beginPhase("hold");
        } else if (phase === "hold") {
          beginPhase("exhale");
        } else if (phase === "exhale") {
          const newRound = nextRound + 1;
          setRound(newRound);
          if (newRound >= ROUNDS) {
            // Done!
            const perfect = scoreRef.current;
            const msg =
              perfect === ROUNDS * 2 ? "Perfect! Pure enlightenment. ☸️" :
              perfect >= ROUNDS      ? "Well done. The breath is with you." :
                                       "Keep practicing. The path is long.";
            setResultMsg(msg);
            beginPhase("complete");
          } else {
            beginPhase("inhale");
          }
        }
      }
    }, 16);

    return () => clearInterval(ticker);
  }, [phase]);

  // ── Colours & labels per phase
  const phaseColor =
    phase === "inhale" ? "#55aaff" :
    phase === "hold"   ? "#ffdd55" :
    phase === "exhale" ? "#88eebb" :
                         "#aaaaaa";

  const phaseLabel =
    phase === "inhale" ? "INHALE — hold SPACE" :
    phase === "hold"   ? "HOLD…" :
    phase === "exhale" ? "EXHALE — release SPACE" :
    phase === "complete" ? "" : "";

  const circleSize = 180 + progress * 80; // breathe in = grow, out = shrink
  const displaySize = phase === "exhale"
    ? 260 - progress * 80
    : circleSize;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.82)",
      backdropFilter: "blur(3px)",
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <div style={{
        background: "#070d18",
        border: "3px solid #1a2a44",
        boxShadow: "8px 8px 0 #000",
        padding: "40px 56px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        minWidth: 420,
      }}>

        {/* Title */}
        <div style={{ fontSize: 13, color: "#ffdd55", letterSpacing: 2, textShadow: "2px 2px #000" }}>
          ☸ MEDITATION BREATH ☸
        </div>

        {/* Round counter */}
        {phase !== "idle" && phase !== "complete" && (
          <div style={{ fontSize: 9, color: "#556677", letterSpacing: 2 }}>
            ROUND {round + 1} / {ROUNDS}
          </div>
        )}

        {/* ── IDLE screen ── */}
        {phase === "idle" && (
          <>
            <div style={{ fontSize: 9, color: "#7799bb", lineHeight: 2.4, textAlign: "center", maxWidth: 320 }}>
              Follow the breath.<br />
              Hold SPACE to inhale.<br />
              Release SPACE to exhale.<br />
              <br />
              Complete {ROUNDS} rounds to earn<br />
              <span style={{ color: "#ffdd55" }}>+{KARMA_REWARD} KARMA</span>
            </div>
            <button onClick={startGame} style={btnStyle("#55aaff", "#1a4488")}>
              ▶ BEGIN
            </button>
            <button onClick={onClose} style={btnStyle("#333", "#111")}>
              BACK
            </button>
          </>
        )}

        {/* ── Active breathing ── */}
        {(phase === "inhale" || phase === "hold" || phase === "exhale") && (
          <>
            {/* Breathing circle */}
            <div style={{
              width: displaySize,
              height: displaySize,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${phaseColor}33 0%, ${phaseColor}11 60%, transparent 100%)`,
              border: `3px solid ${phaseColor}`,
              boxShadow: `0 0 ${20 + progress * 30}px ${phaseColor}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "width 0.05s linear, height 0.05s linear",
              position: "relative",
            }}>
              <div style={{ fontSize: 32 }}>☸</div>
            </div>

            {/* Phase label */}
            <div style={{ fontSize: 9, color: phaseColor, letterSpacing: 2, textAlign: "center", minHeight: 20 }}>
              {phaseLabel}
            </div>

            {/* Progress bar */}
            <div style={{ width: 280, height: 8, background: "#1a2a44", border: "2px solid #334466" }}>
              <div style={{
                width: `${progress * 100}%`,
                height: "100%",
                background: phaseColor,
                transition: "width 0.05s linear",
              }} />
            </div>

            {/* Feedback */}
            <div style={{
              fontSize: 9,
              height: 20,
              color: feedback === "good" ? "#88eebb" : "#ff6655",
              letterSpacing: 1,
            }}>
              {feedback === "good"  ? "✓ PERFECT" :
               feedback === "early" ? "✗ TOO EARLY" :
               feedback === "late"  ? "✗ TOO LATE" : ""}
            </div>

            {/* Score dots */}
            <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: ROUNDS * 2 }).map((_, i) => (
                <div key={i} style={{
                  width: 10, height: 10,
                  background: i < score ? "#88eebb" : "#1a2a44",
                  border: "2px solid #334466",
                }} />
              ))}
            </div>
          </>
        )}

        {/* ── Complete screen ── */}
        {phase === "complete" && (
          <>
            <div style={{ fontSize: 10, color: "#88eebb", letterSpacing: 2, textAlign: "center", lineHeight: 2.2 }}>
              {resultMsg}
            </div>
            <div style={{ fontSize: 9, color: "#ffdd55", letterSpacing: 2 }}>
              +{KARMA_REWARD} KARMA EARNED
            </div>
            <button
              onClick={() => onComplete(KARMA_REWARD)}
              style={btnStyle("#ffdd55", "#aa8800")}
            >
              CLAIM KARMA
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg: string, shadow: string) {
  return {
    fontFamily: "'Press Start 2P', monospace" as const,
    fontSize: 11,
    color: bg === "#ffdd55" ? "#000" : "#fff",
    background: bg,
    border: "none",
    padding: "12px 28px",
    cursor: "pointer",
    letterSpacing: 2,
    boxShadow: `4px 4px 0 ${shadow}, 0 0 0 2px #000`,
  };
}
