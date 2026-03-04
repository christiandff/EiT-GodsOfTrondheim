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
        width: "100px",
        height: "100px",
        imageRendering: "pixelated"
      }}
    />
  );
}
