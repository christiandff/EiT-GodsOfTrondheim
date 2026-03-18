type NPCProps = {
  x: number;
};

export function NPC({ x }: NPCProps) {
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
        imageRendering: "pixelated"
      }}
    />
  );
}
