import { useState, useEffect, useRef } from "react";
import { Player } from "./components/Player";
import { Bus } from "./components/Bus";
import { NPC } from "./components/NPC";
import { Dialog } from "./components/Dialog";
import { MainMenu } from "./components/MainMenu";
import { scenes } from "./scenes";
import { KarmaBar } from "./components/KarmaBar";
import { PauseMenu } from "./components/PauseMenu";
import { BreathingMinigame } from "./components/BreathingMinigame";

const MOVE_SPEED = 5; // px per frame

export default function App() {
  const PLAYER_WIDTH = 48;
  const GROUND_Y = 10;

  const [currentScene, setCurrentScene] = useState(0);
  const scene = scenes[currentScene];
  const WORLD_WIDTH = scene.width;

  const [playerX, setPlayerX] = useState(200);
  const [playerY, setPlayerY] = useState(GROUND_Y);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [isWalking, setIsWalking] = useState(false);

  // All held keys tracked as refs — never stale inside the game loop
  const keysRef = useRef<Set<string>>(new Set());
  const isPressingERef = useRef(false);
  const velocityYRef = useRef(0);
  const playerYRef = useRef(GROUND_Y);
  const playerXRef = useRef(200);
  const isTalkingRef = useRef(false);
  const isPausedRef = useRef(false);

  const [isTalking, setIsTalking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [questionSelected, setQuestionSelected] = useState<number | null>(null);
  const [npcResponse, setNpcResponse] = useState<string | null>(null);

  const BUS_X = WORLD_WIDTH - 350;
  const TEMPLE_DOOR_X = WORLD_WIDTH / 2;
  const NPC_X = 600;

  const [karma, setKarma] = useState(0);
  const [showMinigame, setShowMinigame] = useState(false);

  // Keep refs in sync with state
  useEffect(() => { playerYRef.current = playerY; }, [playerY]);
  useEffect(() => { playerXRef.current = playerX; }, [playerX]);
  useEffect(() => { isTalkingRef.current = isTalking; }, [isTalking]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  function startGame() {
    setCurrentScene(1);
    setPlayerX(200);
    playerXRef.current = 200;
  }

  // ENTER to start
  useEffect(() => {
    function handleEnter(e: KeyboardEvent) {
      if (currentScene === 0 && e.key === "Enter") startGame();
    }
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [currentScene]);

  // ESC to pause/resume
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && currentScene !== 0) {
        setIsPaused(prev => !prev);
      }
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [currentScene]);
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === "e" || e.key === "E") isPressingERef.current = true;
    }
    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key.toLowerCase());
      if (e.key === "e" || e.key === "E") isPressingERef.current = false;
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Jump on spacebar keydown (single press, not held)
  useEffect(() => {
    if (currentScene === 0) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " " && !e.repeat && playerYRef.current <= GROUND_Y + 1) {
        velocityYRef.current = 18;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentScene]);

  // Main game loop — handles movement + gravity at 60fps
  useEffect(() => {
    if (currentScene === 0) return;

    const loop = setInterval(() => {
      if (isTalkingRef.current) return;
      if (isPausedRef.current) return;

      const keys = keysRef.current;
      let dx = 0;

      if (keys.has("a")) dx = -MOVE_SPEED;
      if (keys.has("d")) dx = MOVE_SPEED;

      if (dx !== 0) {
        setFacing(dx > 0 ? "right" : "left");
        setIsWalking(true);
        setPlayerX(prev => {
          const next = Math.max(0, Math.min(prev + dx, WORLD_WIDTH - PLAYER_WIDTH));
          playerXRef.current = next;
          return next;
        });
      } else {
        setIsWalking(false);
      }

      // Gravity + vertical movement
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
    }, 16);

    return () => clearInterval(loop);
  }, [currentScene, WORLD_WIDTH]);

  // Scene switching + NPC interaction
  // FIX: playerX is now in the dependency array so it's never stale
  useEffect(() => {
    if (
      currentScene === 1 &&
      Math.abs(playerX - BUS_X) < 80 &&
      isPressingERef.current
    ) {
      setCurrentScene(2);
      setPlayerX(200);
    }

    if (
      currentScene === 2 &&
      Math.abs(playerX - TEMPLE_DOOR_X) < 80 &&
      isPressingERef.current
    ) {
      setCurrentScene(3);
      setPlayerX(200);
    }

    if (
      currentScene === 1 &&
      Math.abs(playerX - NPC_X) < 80 &&
      isPressingERef.current &&
      !isTalking
    ) {
      setIsTalking(true);
      setQuestionSelected(null);
      setNpcResponse(null);
    }
  }, [playerX, currentScene, isTalking]);

  function handleMeditate() {
    setIsTalking(false);
    setShowMinigame(true);
  }

  function handleMinigameComplete(earned: number) {
    setKarma(prev => Math.min(prev + earned, 100));
    setShowMinigame(false);
  }

  function handleMinigameClose() {
    setShowMinigame(false);
    setIsTalking(true); // return to dialog
  }

  // Dialog logic
  function handleQuestion(index: number) {
    setQuestionSelected(index);

    const responses = [
      [
        "Buddhism? I think it's about finding calm even when the buses are late.",
        "I heard Buddhists meditate a lot. Even while waiting for coffee."
      ],
      [
        "Probably peacefully. Maybe they smile at strangers and recycle properly.",
        "I guess they live like everyone else, just with more mindfulness."
      ]
    ];

    const random = Math.floor(Math.random() * responses[index].length);
    setNpcResponse(responses[index][random]);
  }

  function handleCloseDialog() {
    setIsTalking(false);
    setQuestionSelected(null);
    setNpcResponse(null);
  }

  function handleBackToQuestions() {
    setQuestionSelected(null);
    setNpcResponse(null);
  }

  // Camera
  let cameraX = playerX - window.innerWidth / 2;
  if (cameraX < 0) cameraX = 0;
  const maxCameraX = Math.max(0, WORLD_WIDTH - window.innerWidth);
  if (cameraX > maxCameraX) cameraX = maxCameraX;

  const playerScale = currentScene === 3 ? 1.6 : 1.15;

  // Press E prompt — world-space X position + label
  const nearNPC    = currentScene === 1 && Math.abs(playerX - NPC_X) < 80 && !isTalking;
  const nearTemple = currentScene === 2 && Math.abs(playerX - TEMPLE_DOOR_X) < 80;
  const nearBus    = currentScene === 1 && Math.abs(playerX - BUS_X) < 80;
  const promptX    = nearNPC ? NPC_X : nearTemple ? TEMPLE_DOOR_X : nearBus ? BUS_X : null;
  const promptLabel = nearTemple ? "Enter Temple" : nearBus ? "Board Bus" : "Talk";

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      {/* WORLD */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -cameraX,
          width: WORLD_WIDTH,
          height: "100vh",
          backgroundImage: `url(${scene.background})`,
          backgroundSize: `${WORLD_WIDTH}px 100%`,
          backgroundRepeat: "no-repeat"
        }}
      >
        {currentScene !== 0 && (
          <Player
            x={playerX}
            y={playerY}
            scale={playerScale}
            facing={facing}
            isWalking={isWalking}
          />
        )}

        {currentScene === 1 && <Bus x={BUS_X} />}
        {currentScene === 1 && <NPC x={NPC_X} />}

        {/* Press E prompt — floats above interaction point in world space */}
        {promptX !== null && (
          <div style={{
            position: "absolute",
            left: promptX - 10,
            bottom: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            animation: "prompt-bob 1s ease-in-out infinite alternate",
            pointerEvents: "none",
          }}>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: "#ffdd55",
              textShadow: "2px 2px #000, 0 0 10px #ffdd5588",
              letterSpacing: 1,
              whiteSpace: "nowrap",
            }}>
              {promptLabel}
            </span>
            <div style={{
              background: "#ffdd55",
              color: "#000",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              padding: "4px 10px",
              boxShadow: "3px 3px 0 #aa8800, 0 0 0 2px #000",
              whiteSpace: "nowrap",
            }}>
              E
            </div>
            <div style={{ width: 2, height: 10, background: "#ffdd5599" }} />
          </div>
        )}
      </div>

      {/* MENU */}
      {currentScene === 0 && <MainMenu onStart={startGame} />}

      {/* DIALOG */}
      {isTalking && currentScene === 1 && (
        <Dialog
          questionSelected={questionSelected}
          onSelect={handleQuestion}
          onClose={handleCloseDialog}
          onBack={handleBackToQuestions}
          response={npcResponse}
          onMeditate={handleMeditate}
        />
      )}

      <KarmaBar karma={karma} />
      {isPaused && <PauseMenu onResume={() => setIsPaused(false)} />}
      {showMinigame && (
        <BreathingMinigame
          onComplete={handleMinigameComplete}
          onClose={handleMinigameClose}
        />
      )}
    </div>
  );
}
