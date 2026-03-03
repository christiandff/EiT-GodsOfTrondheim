type PlayerProps = {
  x: number;
  y: number;
  scale: number;
  facing: "left" | "right";
  isWalking: boolean;
};

export function Player({ x, y, scale, facing }: PlayerProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: y,
        transform: `scale(${scale}) scaleX(${facing === "left" ? -1 : 1})`,
        transformOrigin: "center",
        width: 100,
        height: 100
      }}
    >
      <img
        src="/sprites/player_idle.png"
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated"
        }}
      />
    </div>
  );
}
