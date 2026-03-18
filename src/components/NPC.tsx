type NPCProps = { x: number; flipped: boolean; isInteracting: boolean };
export function NPC({ x, flipped }: NPCProps) {
  return (
    <img src="/sprites/NPC.png" alt="NPC" style={{
      position: "absolute", bottom: "40px", left: x,
      width: "160px", height: "160px", imageRendering: "pixelated",
      transform: flipped ? "scaleX(-1)" : "scaleX(1)",
    }} />
  );
}
