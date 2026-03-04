type PlayerProps = {
  x: number;
  y: number;
  scale: number;
  facing: "left" | "right";
  isWalking: boolean;
  skinIndex: number;
};

const SKINS = [
  "/sprites/player_idle.png",
  "/sprites/player_idle_1.png",
  "/sprites/player_idle_2.png",
  "/sprites/player_idle_3.png",
  "/sprites/player_idle_4.png",
  "/sprites/player_idle_5.png"
];

export function Player({ x, y, scale, facing, skinIndex }: PlayerProps) {
  const sprite = SKINS[skinIndex % SKINS.length];

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
        src={sprite}
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated"
        }}
      />
    </div>
  );
}
