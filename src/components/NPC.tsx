type NPCProps = {
  x: number;           // actual world position (controlled by App)
  flipped: boolean;
  isInteracting?: boolean;
};

export function NPC({ x, flipped, isInteracting = false }: NPCProps) {
  return (
    <img
      src="/sprites/NPC.png"
      alt="NPC"
      style={{
        position: "absolute",
        bottom: "40px",
        left: x,
        width: "160px",
        height: "160px",
        imageRendering: "pixelated",
        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
      }}
    />
  );
}
