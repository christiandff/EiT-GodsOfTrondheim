type PlayerProps = {
  x: number;
};

export function Player({ x }: PlayerProps) {
  return (
    <img
      src="/sprites/player_idle.png"
      alt="Player"
      style={{
        position: "absolute",
        bottom: "40px",
        left: x,
        width: "150px",
        height: "150px",
        imageRendering: "pixelated"
      }}
    />
  );
}
