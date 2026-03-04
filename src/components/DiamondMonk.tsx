type DiamondMonkProps = {
  x: number;
};

export function DiamondMonk({ x }: DiamondMonkProps) {
  return (
    <img
      src="/sprites/monk_d.png"
      alt="Diamond Way Teacher"
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
