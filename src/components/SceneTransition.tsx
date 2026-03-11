import { useEffect, useState, useRef } from "react";

// ── Transition texts per scene change ─────────────────────
// Key format: "fromScene-toScene"
const TRANSITION_TEXTS: Record<string, string> = {
  "0-1": `Trondheim is one of Norway's largest cities and a cultural crossroads for many religions. While the city is famous for the grand Nidaros Cathedral, it is also a melting pot of diverse traditions and beliefs.\n\nWanting to learn more about Buddhism, I've travelled into the city center to speak with everyday people. I want to hear what they know about Buddhism, and how they think Buddhists live here in Trondheim.`,

  "1-2": `After talking to people around the city, I've learned a lot about what the general public associates with Buddhism.\n\nNow I'm heading to the Buddhist temple in Tiller to meet the monk who lives and practices there. He will be able to give me deeper insight into Buddhism and explain how the religion connects to life in Trondheim.`,

  "3-4": `My conversation with the monk was both inspiring and enlightening. We shared tea and talked about how the Buddhist lifestyle can adapt to different people and places. The visit left a strong impression on me.\n\nNow I'm returning to Trondheim to visit another Buddhist center: Diamond Way. There, I'll meet a practitioner who will explain how he lives with Buddhism in his daily life, and how they build connections with the community.`,

  "4-5": `I have now spoken with everyday people, a monk, and a Diamond Way Buddhist. Each of them has taught me something different, and my journey as a seeker of Buddhist understanding feels complete.\n\nI began with little knowledge, but step by step I have uncovered insight — perhaps even a glimpse of nirvana. Now I face a simple but profound choice: remain in this state of enlightenment, or return to the world as a bodhisattva.`,
};

const FALLBACK_TEXT = "Loading next chapter...";

// Typing speed in milliseconds per character
const CHAR_DELAY = 28;

type SceneTransitionProps = {
  fromScene: number;
  toScene: number;
  onDone: () => void;
};

export function SceneTransition({ fromScene, toScene, onDone }: SceneTransitionProps) {
  const key = `${fromScene}-${toScene}`;
  const fullText = TRANSITION_TEXTS[key] ?? FALLBACK_TEXT;

  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Typewriter effect
  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(fullText.slice(0, indexRef.current));

      if (indexRef.current >= fullText.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
      }
    }, CHAR_DELAY);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fullText]);

  // Skip — show full text immediately
  function handleSkip() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed(fullText);
    setDone(true);
  }

  // Render \n as line breaks
  const lines = displayed.split("\n");

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 100,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 80px",
    }}>
      {/* Scanlines */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)",
        pointerEvents: "none",
      }} />

      {/* Chapter marker */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 9,
        color: "#334466",
        letterSpacing: 3,
        marginBottom: 40,
        alignSelf: "flex-start",
      }}>
        ☸ GODS OF TRONDHEIM
      </div>

      {/* Text box */}
      <div style={{
        maxWidth: 760,
        width: "100%",
        minHeight: 200,
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 12,
        color: "#ccddff",
        lineHeight: 2.4,
        letterSpacing: 1,
        textShadow: "0 0 8px #4466aa55",
        alignSelf: "flex-start",
      }}>
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <><br /><br /></>}
          </span>
        ))}
        {/* Blinking cursor */}
        {!done && (
          <span style={{
            display: "inline-block",
            width: 10,
            height: 14,
            background: "#ccddff",
            marginLeft: 3,
            verticalAlign: "middle",
            animation: "cursor-blink 0.7s step-start infinite",
          }} />
        )}
      </div>

      {/* Buttons */}
      <div style={{
        marginTop: 48,
        display: "flex",
        gap: 16,
        alignSelf: "flex-end",
      }}>
        {!done && (
          <button
            onClick={handleSkip}
            style={btnStyle("#334466", "#111f33")}
          >
            SKIP ▶▶
          </button>
        )}
        {done && (
          <button
            onClick={onDone}
            style={btnStyle("#ffdd55", "#aa8800", "#000")}
          >
            CONTINUE ▶
          </button>
        )}
      </div>

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function btnStyle(bg: string, shadow: string, color = "#fff"): React.CSSProperties {
  return {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 10,
    color,
    background: bg,
    border: "none",
    padding: "12px 24px",
    cursor: "pointer",
    letterSpacing: 2,
    boxShadow: `4px 4px 0 ${shadow}, 0 0 0 2px #000`,
  };
}
