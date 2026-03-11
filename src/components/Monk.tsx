type MonkProps = {
  x: number;
  flipped: boolean;
  isInteracting?: boolean;
};

export function Monk({ x, flipped, isInteracting = false }: MonkProps) {
  return (
    <img
      src="/sprites/monk_idle.png"
      alt="Monk"
      style={{
        position: "absolute",
        bottom: "40px",
        left: x,
        width: "260px",
        height: "260px",
        imageRendering: "pixelated",
        zIndex: 2,
        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
      }}
    />
  );
}
