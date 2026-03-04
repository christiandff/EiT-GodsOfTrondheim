type NPC2Props = { x: number };

export function NPC2({ x }: NPC2Props) {
  return (
    <img
      src="/sprites/NPC2.png"
      alt="NPC2"
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
