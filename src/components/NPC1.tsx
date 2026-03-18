type NPC1Props = { x: number };

export function NPC1({ x }: NPC1Props) {
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
        imageRendering: "pixelated"
      }}
    />
  );
}
