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
  "/sprites/player_idle1.png",
  "/sprites/player_idle2.png",
  "/sprites/player_idle3.png",
  "/sprites/player_idle4.png",
  "/sprites/player_idle5.png",
];

export function Player({ x, y, scale, facing, skinIndex }: PlayerProps) {
  const sprite = SKINS[skinIndex % SKINS.length];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: y,
        width: 140,
        height: 140,
        transform: `scale(${scale}) scaleX(${facing === "left" ? -1 : 1})`,
        transformOrigin: "center",
        zIndex: 3, // alltid øverst
        pointerEvents: "none" // valgfritt: gjør at player ikke blokkerer klikk
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
