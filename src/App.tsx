import { useState, useEffect } from "react";
import { Player } from "./components/Player";
import { Bus } from "./components/Bus";
import { NPC } from "./components/NPC";
import { Dialog } from "./components/Dialog";
import { MainMenu } from "./components/MainMenu";
import { scenes } from "./scenes";

export default function App() {
  const PLAYER_WIDTH = 48;

  const [currentScene, setCurrentScene] = useState(0); // 0 = menu
  const scene = scenes[currentScene];
  const WORLD_WIDTH = scene.width;

  const [playerX, setPlayerX] = useState(200);
  const [isPressingE, setIsPressingE] = useState(false);

  const [isTalking, setIsTalking] = useState(false);
  const [questionSelected, setQuestionSelected] = useState<number | null>(null);
  const [npcResponse, setNpcResponse] = useState<string | null>(null);

  const BUS_X = WORLD_WIDTH - 350;
  const TEMPLE_DOOR_X = WORLD_WIDTH / 2;
  const NPC_X = 600;

  // Start game from menu
  function startGame() {
    setCurrentScene(1);
    setPlayerX(200);
  }

  // ENTER to start
  useEffect(() => {
    function handleEnter(e: KeyboardEvent) {
      if (currentScene === 0 && e.key === "Enter") {
        startGame();
      }
    }
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [currentScene]);

  // Register E
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "e" || e.key === "E") setIsPressingE(true);
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "e" || e.key === "E") setIsPressingE(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Movement
  useEffect(() => {
    if (currentScene === 0) return; // No movement in menu
    if (isTalking) return; // No movement while talking

    function handleKey(e: KeyboardEvent) {
      setPlayerX(prev => {
        let next = prev;

        if (e.key === "d" || e.key === "D") next = prev + 10;
        if (e.key === "a" || e.key === "A") next = prev - 10;

        if (next < 0) next = 0;
        if (next > WORLD_WIDTH - PLAYER_WIDTH) next = WORLD_WIDTH - PLAYER_WIDTH;

        return next;
      });
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [WORLD_WIDTH, currentScene, isTalking]);

  // Scene switching + NPC
  useEffect(() => {
    // Scene 1 → 2 (bus)
    if (currentScene === 1 && Math.abs(playerX - BUS_X) < 80) {
      setCurrentScene(2);
      setPlayerX(200);
    }

    // Scene 2 → 3 (door + E)
    if (
      currentScene === 2 &&
      Math.abs(playerX - TEMPLE_DOOR_X) < 80 &&
      isPressingE
    ) {
      setCurrentScene(3);
      setPlayerX(200);
    }

    // NPC interaction in scene 1
    if (
      currentScene === 1 &&
      Math.abs(playerX - NPC_X) < 80 &&
      isPressingE &&
      !isTalking
    ) {
      setIsTalking(true);
      setQuestionSelected(null);
      setNpcResponse(null);
    }
  }, [playerX, currentScene, isPressingE, isTalking, BUS_X, TEMPLE_DOOR_X, NPC_X]);

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

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative"
      }}
    >
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
        {currentScene !== 0 && <Player x={playerX} scale={playerScale} />}
        {currentScene === 1 && <Bus x={BUS_X} />}
        {currentScene === 1 && <NPC x={NPC_X} />}
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
        />
      )}
    </div>
  );
}
