import { useState, useEffect, useRef } from "react";

type MaraFightProps = {
  onVictory: () => void;
  onDefeat: () => void;
  skinIndex: number; // reincarnation skin
};

// ── Constants ─────────────────────────────────────────────
const MARA_MAX_HP = 10;
const PLAYER_MAX_HP = 3;

const SKINS = [
  "/sprites/player_idle.png",
  "/sprites/player_idle1.png",
  "/sprites/player_idle2.png",
  "/sprites/player_idle3.png",
  "/sprites/player_idle4.png",
  "/sprites/player_idle5.png",
];
const GAME_W = 1100;
const GAME_H = 580;
const BALL_SPEED = 5;
const MARA_BALL_SPEED = 6;
const PLAYER_SPEED = 6;
const BALL_RADIUS = 14;
const PLAYER_W = 64;
const PLAYER_H = 64;
const MARA_W = 220;
const MARA_H = 280;
const MARA_BALL_INTERVAL = 1800;
const INVINCIBLE_MS = 1200;

// ── Dialog lines before fight ─────────────────────────────
const DIALOG_LINES = [
  { speaker: "MARA", text: "So... you think you have earned Nirvana? How amusing." },
  { speaker: "MARA", text: "I have tempted kings and sages. You are nothing but a wanderer with a karma bar." },
  { speaker: "MARA", text: "Face me, and we shall see if your enlightenment is real." },
  { speaker: "YOU",  text: "I have walked through Trondheim, spoken with monks, and poured tea with patience." },
  { speaker: "YOU",  text: "I am ready. Come." },
];

type Vec2 = { x: number; y: number };
type Ball = Vec2 & { id: number; vx: number; vy: number };

export function MaraFight({ onVictory, onDefeat, skinIndex }: MaraFightProps) {
  // ── Phase state ───────────────────────────────────────
  const [phase, setPhase] = useState<"dialog" | "instructions" | "fight" | "victory" | "defeat">("dialog");
  const [dialogIdx, setDialogIdx] = useState(0);

  // ── Fight state ───────────────────────────────────────
  const [maraHp, setMaraHp]       = useState(MARA_MAX_HP);
  const [maraX, setMaraX]         = useState(GAME_W / 2 - 110);

  const maraXRef      = useRef(GAME_W / 2 - 110);
  const maraPatrolDir = useRef(1);
  const MARA_BASE_X   = GAME_W / 2 - 110;
  const MARA_PATROL   = 100; // 200px total (100 each way)
  const [playerHp, setPlayerHp]   = useState(PLAYER_MAX_HP);
  const [playerX, setPlayerX]     = useState(GAME_W / 2 - PLAYER_W / 2);
  const [playerY, setPlayerY]     = useState(0);
  const [playerFacing, setPlayerFacing] = useState<"left" | "right">("right");

  const velocityYRef = useRef(0);
  const playerYRef   = useRef(0);
  const GROUND_Y     = 0;
  const [karmaBalls, setKarmaBalls] = useState<Ball[]>([]);
  const [maraBalls, setMaraBalls]   = useState<Ball[]>([]);
  const [invincible, setInvincible] = useState(false);
  const [maraFlash, setMaraFlash]   = useState(false);
  const [playerFlash, setPlayerFlash] = useState(false);

  // Refs for game loop
  const keysRef      = useRef<Set<string>>(new Set());
  const playerXRef   = useRef(GAME_W / 2 - PLAYER_W / 2);
  const karmaBallsRef = useRef<Ball[]>([]);
  const maraBallsRef  = useRef<Ball[]>([]);
  const maraHpRef     = useRef(MARA_MAX_HP);
  const playerHpRef   = useRef(PLAYER_MAX_HP);
  const invincibleRef = useRef(false);
  const ballIdRef     = useRef(0);
  const phaseRef      = useRef<"dialog" | "instructions" | "fight" | "victory" | "defeat">("dialog");

  // Sync refs
  karmaBallsRef.current = karmaBalls;
  maraBallsRef.current  = maraBalls;
  invincibleRef.current = invincible;
  phaseRef.current      = phase;

  // ── Keyboard ──────────────────────────────────────────
  useEffect(() => {
    function onDown(e: KeyboardEvent) {
      keysRef.current.add(e.key.toLowerCase());
      // Shoot karma ball on R
      if ((e.key === "r" || e.key === "R") && !e.repeat && phaseRef.current === "fight") {
        e.preventDefault();
        const id = ballIdRef.current++;
        const ball: Ball = {
          id, x: playerXRef.current + PLAYER_W / 2 - BALL_RADIUS,
          y: GAME_H - playerYRef.current - 80, vx: 0, vy: -BALL_SPEED,
        };
        setKarmaBalls(prev => [...prev, ball]);
      }
      // Jump on SPACE
      if (e.key === " " && !e.repeat && phaseRef.current === "fight") {
        e.preventDefault();
        if (playerYRef.current <= 1) velocityYRef.current = 16;
      }
    }
    function onUp(e: KeyboardEvent) { keysRef.current.delete(e.key.toLowerCase()); }
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // ── Mara shoots 3 balls in a burst periodically ────────
  useEffect(() => {
    if (phase !== "fight") return;

    function fireBurst() {
      // Fire 3 balls with 200ms between each
      [0, 200, 400].forEach(delay => {
        setTimeout(() => {
          if (phaseRef.current !== "fight") return;
          const id = ballIdRef.current++;
          const targetX = playerXRef.current + PLAYER_W / 2;
          const startX  = maraXRef.current + MARA_W / 2;
          const startY  = MARA_H + 20;
          const angle   = Math.atan2(GAME_H - 80 - startY, targetX - startX);
          const ball: Ball = {
            id, x: startX, y: startY,
            vx: Math.cos(angle) * MARA_BALL_SPEED,
            vy: Math.sin(angle) * MARA_BALL_SPEED,
          };
          setMaraBalls(prev => [...prev, ball]);
        }, delay);
      });
    }

    const interval = setInterval(fireBurst, MARA_BALL_INTERVAL);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Main game loop ────────────────────────────────────
  useEffect(() => {
    if (phase !== "fight") return;

    const loop = setInterval(() => {
      if (phaseRef.current !== "fight") return;

      // Move Mara left/right patrol
      const nextMaraX = maraXRef.current + maraPatrolDir.current * 1.2;
      if (nextMaraX > MARA_BASE_X + MARA_PATROL) maraPatrolDir.current = -1;
      if (nextMaraX < MARA_BASE_X - MARA_PATROL) maraPatrolDir.current = 1;
      maraXRef.current = nextMaraX;
      setMaraX(nextMaraX);

      // Move player
      const keys = keysRef.current;
      let dx = 0;
      if (keys.has("a") || keys.has("arrowleft"))  dx = -PLAYER_SPEED;
      if (keys.has("d") || keys.has("arrowright"))  dx =  PLAYER_SPEED;
      if (dx !== 0) {
        setPlayerFacing(dx > 0 ? "right" : "left");
        const next = Math.max(0, Math.min(playerXRef.current + dx, GAME_W - PLAYER_W));
        playerXRef.current = next;
        setPlayerX(next);
      }

      // Gravity + jump
      velocityYRef.current -= 1.1;
      const nextY = playerYRef.current + velocityYRef.current;
      if (nextY <= GROUND_Y) {
        velocityYRef.current = 0;
        playerYRef.current = GROUND_Y;
        setPlayerY(GROUND_Y);
      } else {
        playerYRef.current = nextY;
        setPlayerY(nextY);
      }

      // Move karma balls + check Mara collision
      setKarmaBalls(prev => {
        const next = prev
          .map(b => ({ ...b, y: b.y + b.vy }))
          .filter(b => {
            // Hit Mara? centered at maraXRef
            const maraLeft = maraXRef.current;
            if (b.x + BALL_RADIUS*2 > maraLeft &&
                b.x < maraLeft + MARA_W &&
                b.y < MARA_H + 20 && b.y + BALL_RADIUS*2 > 20) {
              const newHp = maraHpRef.current - 1;
              maraHpRef.current = newHp;
              setMaraHp(newHp);
              setMaraFlash(true);
              setTimeout(() => setMaraFlash(false), 200);
              if (newHp <= 0) {
                phaseRef.current = "victory";
                setPhase("victory");
                setTimeout(onVictory, 2000);
              }
              return false; // remove ball
            }
            return b.y > -BALL_RADIUS * 2; // remove if off screen
          });
        karmaBallsRef.current = next;
        return next;
      });

      // Move Mara balls + check player collision
      setMaraBalls(prev => {
        const next = prev
          .map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
          .filter(b => {
            const px = playerXRef.current;
            const py = GAME_H - PLAYER_H - 10 - playerYRef.current;
            if (!invincibleRef.current &&
                b.x + BALL_RADIUS*2 > px && b.x < px + PLAYER_W &&
                b.y + BALL_RADIUS*2 > py && b.y < py + PLAYER_H) {
              const newHp = playerHpRef.current - 1;
              playerHpRef.current = newHp;
              setPlayerHp(newHp);
              setPlayerFlash(true);
              setTimeout(() => setPlayerFlash(false), 200);
              // Invincibility frames
              invincibleRef.current = true;
              setInvincible(true);
              setTimeout(() => { invincibleRef.current = false; setInvincible(false); }, INVINCIBLE_MS);
              if (newHp <= 0) {
                phaseRef.current = "defeat";
                setPhase("defeat");
                setTimeout(onDefeat, 2000);
              }
              return false;
            }
            // Remove if off screen
            return b.x > -50 && b.x < GAME_W + 50 && b.y < GAME_H + 50;
          });
        maraBallsRef.current = next;
        return next;
      });

    }, 16);

    return () => clearInterval(loop);
  }, [phase]);

  // ── Dialog phase ──────────────────────────────────────
  if (phase === "dialog") {
    const line = DIALOG_LINES[dialogIdx];
    const isLast = dialogIdx >= DIALOG_LINES.length - 1;
    return (
      <div style={overlay}>
        <div style={dialogBox}>
          {/* Speaker image */}
          <img src={line.speaker === "MARA" ? "/sprites/mara.png" : SKINS[skinIndex % SKINS.length]} style={{
            width: 120, height: 120, imageRendering: "pixelated",
            marginBottom: 16, filter: line.speaker === "MARA" ? "drop-shadow(0 0 16px #ff440088)" : "drop-shadow(0 0 16px #55aaff88)",
          }} />

          <div style={{ fontSize: 9, color: line.speaker === "MARA" ? "#ff6644" : "#55aaff", letterSpacing: 2, marginBottom: 12 }}>
            ⚔ {line.speaker}
          </div>
          <div style={{ fontSize: 11, color: "#ffddcc", lineHeight: 2.2, marginBottom: 24, maxWidth: 480, textAlign: "center" }}>
            "{line.text}"
          </div>

          <button
            onClick={() => {
              if (isLast) setPhase("instructions");
              else setDialogIdx(i => i + 1);
            }}
            style={btnStyle("#ff6644", "#aa2200")}
          >
            {isLast ? "NEXT ▶" : "NEXT ▶"}
          </button>
        </div>
      </div>
    );
  }

  // ── Instructions phase ──────────────────────────────────
  if (phase === "instructions") {
    return (
      <div style={overlay}>
        <div style={dialogBox}>
          <div style={{ fontSize: 16, color: "#ffdd55", textShadow: "0 0 16px #ffdd55", marginBottom: 32 }}>
            ⚔ HOW TO FIGHT ⚔
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                background: "#223", border: "2px solid #556", padding: "8px 16px",
                fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: "#fff",
                minWidth: 60, textAlign: "center",
              }}>A / D</div>
              <div style={{ fontSize: 10, color: "#ccddff", lineHeight: 1.8 }}>Move left and right</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                background: "#223", border: "2px solid #556", padding: "8px 16px",
                fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: "#fff",
                minWidth: 60, textAlign: "center",
              }}>SPACE</div>
              <div style={{ fontSize: 10, color: "#ccddff", lineHeight: 1.8 }}>Jump to dodge Mara's attacks</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                background: "#113322", border: "2px solid #00ff88", padding: "8px 16px",
                fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: "#00ff88",
                minWidth: 60, textAlign: "center",
                boxShadow: "0 0 12px #00ff8844",
              }}>R</div>
              <div style={{ fontSize: 12, color: "#00ff88", lineHeight: 1.8, textShadow: "0 0 8px #00ff8866" }}>
                Shoot karma balls at Mara!
              </div>
            </div>
          </div>

          <div style={{ fontSize: 8, color: "#887766", lineHeight: 2, textAlign: "center", marginBottom: 24 }}>
            Dodge the red orbs, shoot Mara with R, and survive!
          </div>

          <button
            onClick={() => setPhase("fight")}
            style={btnStyle("#ff6644", "#aa2200")}
          >
            ⚔ FIGHT
          </button>
        </div>
      </div>
    );
  }

  // ── Victory / Defeat ──────────────────────────────────
  if (phase === "victory") {
    return (
      <div style={overlay}>
        <div style={dialogBox}>
          <div style={{ fontSize: 22, color: "#ffdd55", textShadow: "0 0 20px #ffdd55", marginBottom: 16 }}>☸ MARA DEFEATED ☸</div>
          <div style={{ fontSize: 10, color: "#ccddff", lineHeight: 2.2 }}>
            Mara dissolves into light.<br />The path to Nirvana is open.
          </div>
        </div>
      </div>
    );
  }

  if (phase === "defeat") {
    return (
      <div style={overlay}>
        <div style={dialogBox}>
          <div style={{ fontSize: 18, color: "#ff6644", textShadow: "0 0 20px #ff6644", marginBottom: 16 }}>✗ MARA WINS</div>
          <div style={{ fontSize: 10, color: "#ccddff", lineHeight: 2.2 }}>
            The mind was not yet ready.<br />The journey continues...
          </div>
        </div>
      </div>
    );
  }

  // ── Fight phase ───────────────────────────────────────
  const maraHpPct = (maraHp / MARA_MAX_HP) * 100;

  return (
    <div style={{ ...overlay, background: "#000" }}>
      <div style={{
        position: "relative",
        width: GAME_W, height: GAME_H,
        background: "radial-gradient(ellipse at center, #1a0a2e 0%, #000 100%)",
        border: "3px solid #550022",
        boxShadow: "0 0 40px #ff440044",
        overflow: "hidden",
      }}>

        {/* ── Mara HP bar ── */}
        <div style={{ position: "absolute", top: 8, left: 16, right: 16 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#ff6644", marginBottom: 4 }}>
            MARA {maraHp}/{MARA_MAX_HP}
          </div>
          <div style={{ height: 12, background: "#330000", border: "2px solid #550022" }}>
            <div style={{ width: `${maraHpPct}%`, height: "100%", background: "#ff4422", transition: "width 0.1s" }} />
          </div>
        </div>

        {/* ── Player HP ── */}
        <div style={{ position: "absolute", bottom: 8, left: 16, fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#55aaff" }}>
          {"♥ ".repeat(playerHp)}{"♡ ".repeat(PLAYER_MAX_HP - playerHp)}
        </div>

        {/* ── Controls hint ── */}
        <div style={{ position: "absolute", bottom: 8, right: 16, fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#334466" }}>
          A/D MOVE · SPACE JUMP · R SHOOT
        </div>

        {/* ── Mara sprite ── */}
        <img
          src="/sprites/mara.png"
          style={{
            position: "absolute",
            left: maraX,
            top: 20,
            width: MARA_W, height: MARA_H,
            imageRendering: "pixelated",
            filter: maraFlash ? "brightness(3) saturate(0)" : "drop-shadow(0 0 20px #ff440088)",
            transition: "filter 0.05s",
          }}
        />

        {/* ── Player ── */}
        <div style={{
          position: "absolute",
          left: playerX,
          bottom: 10 + playerY,
          width: PLAYER_W, height: PLAYER_H,
          opacity: invincible ? 0.5 : 1,
          transition: "opacity 0.1s",
        }}>
          <img
            src={SKINS[skinIndex % SKINS.length]}
            style={{
              width: "100%", height: "100%",
              imageRendering: "pixelated",
              filter: playerFlash ? "brightness(3)" : "none",
              transform: playerFacing === "left" ? "scaleX(-1)" : "scaleX(1)",
            }}
          />
        </div>

        {/* ── Karma balls (player shoots) ── */}
        {karmaBalls.map(b => (
          <div key={b.id} style={{
            position: "absolute",
            left: b.x, top: b.y,
            width: BALL_RADIUS * 2, height: BALL_RADIUS * 2,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffffff 0%, #00ff88 40%, #00cc66 100%)",
            boxShadow: "0 0 12px #00ff88, 0 0 24px #00ff8866",
          }} />
        ))}

        {/* ── Mara balls ── */}
        {maraBalls.map(b => (
          <div key={b.id} style={{
            position: "absolute",
            left: b.x, top: b.y,
            width: BALL_RADIUS * 2, height: BALL_RADIUS * 2,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffaa00 0%, #ff4400 60%, #880000 100%)",
            boxShadow: "0 0 12px #ff4400, 0 0 24px #ff440066",
          }} />
        ))}
      </div>

      <style>{`
        @keyframes mara-bg-pulse {
          from { opacity: 0.6; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────
const overlay: React.CSSProperties = {
  position: "absolute", inset: 0, zIndex: 90,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "#000",
};

const dialogBox: React.CSSProperties = {
  background: "#0a0010",
  border: "3px solid #550022",
  boxShadow: "8px 8px 0 #000, 0 0 40px #ff440033",
  padding: "48px 64px",
  display: "flex", flexDirection: "column", alignItems: "center",
  fontFamily: "'Press Start 2P', monospace",
  maxWidth: 600,
};

function btnStyle(bg: string, shadow: string): React.CSSProperties {
  return {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 13, color: "#000", background: bg, border: "none",
    padding: "14px 32px", cursor: "pointer", letterSpacing: 2,
    boxShadow: `4px 4px 0 ${shadow}, 0 0 0 2px #000`,
    marginTop: 8,
  };
}
