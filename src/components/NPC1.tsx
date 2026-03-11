type NPC1Props = {
  x: number;
  flipped: boolean;
  isInteracting?: boolean;
};

export function NPC1({ x, flipped, isInteracting = false }: NPC1Props) {
  return (
    <img
      src="/sprites/NPC1.png"
      alt="NPC1"
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
