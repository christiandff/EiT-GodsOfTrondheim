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
import { MeditationMinigame } from "./components/MeditationMinigame";
import { TeaMinigame } from "./components/TeaMinigame";
import { Monk } from "./components/Monk";
import { MonkDialog } from "./components/MonkDialog";
import { DiamondMonk } from "./components/DiamondMonk";
import { DiamondMonkDialog } from "./components/DiamondMonkDialog";
import { NPC1 } from "./components/NPC1";
import { NPC2 } from "./components/NPC2";
import { NPC1Dialog } from "./components/NPC1Dialog";
import { NPC2Dialog } from "./components/NPC2Dialog";
import { SceneTransition } from "./components/SceneTransition";

// ── Transition videos ─────────────────────────────────────────────────────
// Key format: "fromScene-toScene"
// Set a value to null to skip the video for that transition.
// Swap out the file paths below when you have your own videos ready.
const TRANSITION_VIDEOS: Record<string, string | null> = {
  "0-1": "/sprites/b1.MOV",   // Menu → Trondheim
  "1-2": "/sprites/b1.MOV",   // Trondheim → Temple exterior
  "2-3": null,                 // Temple exterior → Temple inside (no video)
  "3-4": "/sprites/b1.MOV",   // Temple inside → Diamondway
  "4-5": "/sprites/b1.MOV",   // Diamondway → Nirvana
};
// ─────────────────────────────────────────────────────────────────────────

const MOVE_SPEED = 10;

export default function App() {
  const PLAYER_WIDTH = 48;
  const GROUND_Y = 40;

  const [currentScene, setCurrentScene] = useState(0);
  const [pendingScene, setPendingScene] = useState<number | null>(null);
  const scene = scenes[currentScene as keyof typeof scenes];
  const WORLD_WIDTH = (currentScene === 4)
    ? window.innerWidth
    : scene.width;

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
  const pendingSceneRef = useRef<number | null>(null);
  const isTalkingToMonkRef = useRef(false);
  const isTalkingToDiamondMonkRef = useRef(false);
  const isTalkingToNPC1Ref = useRef(false);
  const isTalkingToNPC2Ref = useRef(false);
  const showTeaMinigameRef = useRef(false);
  const showDiamondMinigameRef = useRef(false);

  const [isTalking, setIsTalking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [questionSelected, setQuestionSelected] = useState<number | null>(null);
  const [npcResponse, setNpcResponse] = useState<string | null>(null);

  const BUS_X = WORLD_WIDTH - 350;
  const TEMPLE_DOOR_X = WORLD_WIDTH / 2;
  const NPC_X = 600;
  const NPC1_X = 1400;
  const NPC2_X = 2600;
  const MONK_X = 800;
  const DIAMOND_MONK_X = 600;

  const [karma, setKarma] = useState(0);
  const [showMinigame, setShowMinigame] = useState(false);
  const [showTeaMinigame, setShowTeaMinigame] = useState(false);
  const [showDiamondMinigame, setShowDiamondMinigame] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [reincarnationCount, setReincarnationCount] = useState(0);
  const [isTalkingToMonk, setIsTalkingToMonk] = useState(false);
  const [isTalkingToDiamondMonk, setIsTalkingToDiamondMonk] = useState(false);
  const [isTalkingToNPC1, setIsTalkingToNPC1] = useState(false);
  const [isTalkingToNPC2, setIsTalkingToNPC2] = useState(false);

  // Keep refs in sync with state
  useEffect(() => { playerYRef.current = playerY; }, [playerY]);
  useEffect(() => { playerXRef.current = playerX; }, [playerX]);
  useEffect(() => { isTalkingRef.current = isTalking; }, [isTalking]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { pendingSceneRef.current = pendingScene; }, [pendingScene]);
  useEffect(() => { isTalkingToMonkRef.current = isTalkingToMonk; }, [isTalkingToMonk]);
  useEffect(() => { isTalkingToDiamondMonkRef.current = isTalkingToDiamondMonk; }, [isTalkingToDiamondMonk]);
  useEffect(() => { isTalkingToNPC1Ref.current = isTalkingToNPC1; }, [isTalkingToNPC1]);
  useEffect(() => { isTalkingToNPC2Ref.current = isTalkingToNPC2; }, [isTalkingToNPC2]);
  useEffect(() => { showTeaMinigameRef.current = showTeaMinigame; }, [showTeaMinigame]);
  useEffect(() => { showDiamondMinigameRef.current = showDiamondMinigame; }, [showDiamondMinigame]);

  function startGame() {
    setPlayerX(200);
    playerXRef.current = 200;
    setHasPlayed(true);
    goToScene(1, 0);
  }

  function restartGame() {
    setCurrentScene(0);
    setPlayerX(200);
    playerXRef.current = 200;
    setKarma(0);
    setIsTalking(false);
    setIsPaused(false);
    setShowMinigame(false);
    setQuestionSelected(null);
    setNpcResponse(null);
    velocityYRef.current = 0;
    playerYRef.current = GROUND_Y;
    setPlayerY(GROUND_Y);
    setReincarnationCount(prev => prev + 1);
  }

  function goToScene(n: number, from?: number) {
    const fromScene = from ?? currentScene;
    const video = TRANSITION_VIDEOS[`${fromScene}-${n}`];
    if (video === null || video === undefined) {
      setCurrentScene(n);
    } else {
      setPendingScene(n);
    }
  }

  function handleTransitionDone() {
    if (pendingScene !== null) {
      setCurrentScene(pendingScene);
      setPendingScene(null);
    }
  }
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
    if (currentScene === 0 || currentScene === 5) return;
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
    if (currentScene === 0 || currentScene === 5) return;

    const loop = setInterval(() => {
      if (isTalkingRef.current) return;
      if (isPausedRef.current) return;
      if (isTalkingToMonkRef.current) return;
      if (isTalkingToDiamondMonkRef.current) return;
      if (isTalkingToNPC1Ref.current) return;
      if (isTalkingToNPC2Ref.current) return;
      if (showTeaMinigameRef.current) return;
      if (showDiamondMinigameRef.current) return;
      if (pendingSceneRef.current !== null) return;

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
  useEffect(() => {
    if (pendingScene !== null) return; // don't trigger while transition is playing
    if (currentScene === 5) return; // nirvana is locked

    if (
      currentScene === 1 &&
      Math.abs(playerX - BUS_X) < 80 &&
      isPressingERef.current
    ) {
      setPlayerX(200);
      goToScene(2);
    }

    if (
      currentScene === 2 &&
      Math.abs(playerX - TEMPLE_DOOR_X) < 80 &&
      isPressingERef.current
    ) {
      setPlayerX(200);
      goToScene(3);
    }

    // TempleInside → Diamondway (walk to far right edge)
    if (currentScene === 3 && playerX >= WORLD_WIDTH - PLAYER_WIDTH - 10) {
      setPlayerX(200);
      goToScene(4);
    }

    // Walk back left — no transition video going backwards
    if (currentScene === 4 && playerX <= 10) {
      setCurrentScene(3);
      setPlayerX(WORLD_WIDTH - PLAYER_WIDTH - 20);
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

    if (
      currentScene === 1 &&
      Math.abs(playerX - NPC1_X) < 80 &&
      isPressingERef.current &&
      !isTalkingToNPC1
    ) {
      setIsTalkingToNPC1(true);
    }

    if (
      currentScene === 1 &&
      Math.abs(playerX - NPC2_X) < 80 &&
      isPressingERef.current &&
      !isTalkingToNPC2
    ) {
      setIsTalkingToNPC2(true);
    }

    // Monk interaction in TempleInside (scene 3)
    if (
      currentScene === 3 &&
      Math.abs(playerX - MONK_X) < 80 &&
      isPressingERef.current &&
      !isTalkingToMonk
    ) {
      setIsTalkingToMonk(true);
      setKarma(prev => Math.min(prev + 10, 100));
    }

    // Diamond Way teacher interaction in Diamondway (scene 4)
    if (
      currentScene === 4 &&
      Math.abs(playerX - DIAMOND_MONK_X) < 80 &&
      isPressingERef.current &&
      !isTalkingToDiamondMonk
    ) {
      setIsTalkingToDiamondMonk(true);
      setKarma(prev => Math.min(prev + 10, 100));
    }
  }, [playerX, currentScene, pendingScene, isTalking, isTalkingToMonk, isTalkingToDiamondMonk, isTalkingToNPC1, isTalkingToNPC2]);

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
    setIsTalking(true);
  }

  function handleTeaMinigame() {
    setIsTalkingToMonk(false);
    setShowTeaMinigame(true);
  }

  function handleTeaMinigameComplete(earned: number) {
    setKarma(prev => Math.min(prev + earned, 100));
    setShowTeaMinigame(false);
  }

  function handleTeaMinigameClose() {
    setShowTeaMinigame(false);
    setIsTalkingToMonk(true);
  }

  function handleDiamondMinigame() {
    setIsTalkingToDiamondMonk(false);
    setShowDiamondMinigame(true);
  }

  function handleDiamondMinigameComplete(earned: number) {
    setKarma(prev => Math.min(prev + earned, 100));
    setShowDiamondMinigame(false);
  }

  function handleDiamondMinigameClose() {
    setShowDiamondMinigame(false);
    setIsTalkingToDiamondMonk(true);
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
    setKarma(prev => Math.min(prev + 5, 100));
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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const playerGroundY = currentScene === 3 ? GROUND_Y + 30 : GROUND_Y;
  const playerScale = currentScene === 3 ? 1.98 : 1.44;
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  // playerGroundY handled inline via y prop offset
  const playerScale = currentScene === 3 ? 1.98 : currentScene === 4 ? 1.44 + (40 / 140) : 1.44;
>>>>>>> Stashed changes

  // Press E prompt — world-space X position + label
  const nearNPC         = currentScene === 1 && Math.abs(playerX - NPC_X) < 80 && !isTalking;
  const nearNPC1        = currentScene === 1 && Math.abs(playerX - NPC1_X) < 80 && !isTalkingToNPC1;
  const nearNPC2        = currentScene === 1 && Math.abs(playerX - NPC2_X) < 80 && !isTalkingToNPC2;
  const nearTemple      = currentScene === 2 && Math.abs(playerX - TEMPLE_DOOR_X) < 80;
  const nearBus         = currentScene === 1 && Math.abs(playerX - BUS_X) < 80;
  const nearMonk        = currentScene === 3 && Math.abs(playerX - MONK_X) < 80 && !isTalkingToMonk;
  const nearDiamondMonk = currentScene === 4 && Math.abs(playerX - DIAMOND_MONK_X) < 80 && !isTalkingToDiamondMonk;
  const promptX =
    nearNPC ? NPC_X :
    nearNPC1 ? NPC1_X :
    nearNPC2 ? NPC2_X :
    nearTemple ? TEMPLE_DOOR_X :
    nearBus ? BUS_X :
    nearMonk ? MONK_X :
    nearDiamondMonk ? DIAMOND_MONK_X : null;
  const promptLabel =
    nearTemple ? "Enter Temple" :
    nearBus ? "Board Bus" :
    nearMonk ? "Speak with Monk" :
    nearDiamondMonk ? "Speak with Teacher" : "Talk";

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
          backgroundSize: currentScene === 4 ? "cover" : `${WORLD_WIDTH}px 100%`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: currentScene === 4 ? "center center" : "top left"
        }}
      >
        {currentScene !== 0 && currentScene !== 5 && (
          <Player
            x={playerX}
            y={playerY + (currentScene === 3 ? 50 : 0)}
            scale={playerScale}
            facing={facing}
            isWalking={isWalking}
            skinIndex={reincarnationCount}
          />
        )}

        {currentScene === 1 && <Bus x={BUS_X} />}
        {currentScene === 1 && <NPC x={NPC_X} />}
        {currentScene === 1 && <NPC1 x={NPC1_X} />}
        {currentScene === 1 && <NPC2 x={NPC2_X} />}
        {currentScene === 3 && <Monk x={MONK_X} />}
        {currentScene === 4 && <DiamondMonk x={DIAMOND_MONK_X} />}

        {/* Press E prompt — removed from here, rendered in screen space below */}
      </div>

      {/* Press E prompt — screen-space, always above the player */}
      {promptX !== null && (
        <div style={{
          position: "absolute",
          left: playerX - cameraX + 60,
          bottom: 200,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          animation: "prompt-bob 1s ease-in-out infinite alternate",
          pointerEvents: "none",
          zIndex: 20,
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

      {currentScene === 0 && <MainMenu onStart={startGame} onRestart={hasPlayed ? restartGame : undefined} />}

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

      {currentScene !== 5 && currentScene !== 0 && (
        <KarmaBar karma={karma} onNirvana={() => setPendingScene(5)} />
      )}
      {currentScene === 5 && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 32,
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 22,
            color: "#ffffff",
            textShadow: "0 0 20px #ffffffaa, 3px 3px #000",
            letterSpacing: 3,
            marginBottom: 16,
          }}>
            ☸ NIRVANA ☸
          </div>

          {/* Bodhisattva — restart and play again */}
          <button
            onClick={restartGame}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16,
              color: "#000",
              background: "#ffdd55",
              border: "none",
              padding: "24px 48px",
              cursor: "pointer",
              letterSpacing: 2,
              boxShadow: "6px 6px 0 #aa8800, 0 0 0 3px #000, 0 0 24px #ffdd5566",
            }}
          >
            ☸ BODHISATTVA
          </button>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: "#aaaaaa",
            letterSpacing: 1,
            marginTop: -16,
          }}>
            return to help others
          </div>

          {/* Stay in Nirvana — go to main menu */}
          <button
            onClick={() => {
              setCurrentScene(0);
              setKarma(0);
            }}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16,
              color: "#000",
              background: "#aaddff",
              border: "none",
              padding: "24px 48px",
              cursor: "pointer",
              letterSpacing: 2,
              boxShadow: "6px 6px 0 #336688, 0 0 0 3px #000, 0 0 24px #aaddff66",
              marginTop: 8,
            }}
          >
            ✦ STAY IN NIRVANA
          </button>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: "#aaaaaa",
            letterSpacing: 1,
            marginTop: -16,
          }}>
            return to main menu
          </div>
        </div>
      )}
      {isPaused && <PauseMenu onResume={() => setIsPaused(false)} onRestart={restartGame} onMenu={() => { setIsPaused(false); setCurrentScene(0); setKarma(0); }} />}
      {isTalkingToMonk && currentScene === 3 && (
        <MonkDialog onClose={() => setIsTalkingToMonk(false)} onTeaMinigame={handleTeaMinigame} />
      )}
      {isTalkingToDiamondMonk && currentScene === 4 && (
        <DiamondMonkDialog onClose={() => setIsTalkingToDiamondMonk(false)} onMeditationMinigame={handleDiamondMinigame} />
      )}
      {isTalkingToNPC1 && currentScene === 1 && (
        <NPC1Dialog onClose={() => setIsTalkingToNPC1(false)} onKarma={() => setKarma(prev => Math.min(prev + 5, 100))} />
      )}
      {isTalkingToNPC2 && currentScene === 1 && (
        <NPC2Dialog onClose={() => setIsTalkingToNPC2(false)} onKarma={() => setKarma(prev => Math.min(prev + 5, 100))} />
      )}
      {showMinigame && (
        <BreathingMinigame onComplete={handleMinigameComplete} onClose={handleMinigameClose} />
      )}
      {showTeaMinigame && (
        <TeaMinigame onComplete={handleTeaMinigameComplete} onClose={handleTeaMinigameClose} />
      )}
      {showDiamondMinigame && (
        <MeditationMinigame onComplete={handleDiamondMinigameComplete} onClose={handleDiamondMinigameClose} />
      )}

      {/* Scene transition video — sits on top of everything */}
      {pendingScene !== null && (
        <SceneTransition
          videoSrc={TRANSITION_VIDEOS[`${currentScene}-${pendingScene}`] ?? "/sprites/b1.MOV"}
          onDone={handleTransitionDone}
        />
      )}
    </div>
  );
}
