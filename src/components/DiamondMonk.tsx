type DiamondMonkProps = {
  x: number;
  flipped: boolean;
  isInteracting?: boolean;
};

export function DiamondMonk({ x, flipped, isInteracting = false }: DiamondMonkProps) {
  return (
    <img
      src="/sprites/monk_d.png"
      alt="Diamond Way Teacher"
      style={{
        position: "absolute",
        bottom: "40px",
        left: x,
        width: "210px",
        height: "210px",
        imageRendering: "pixelated",
        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
      }}
    />
  );
}
