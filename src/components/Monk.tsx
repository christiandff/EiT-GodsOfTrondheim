type MonkProps = {
  x: number;
};

export function Monk({ x }: MonkProps) {
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
        zIndex: 2 // ligger bak player, men foran bakgrunn
      }}
    />
  );
}
