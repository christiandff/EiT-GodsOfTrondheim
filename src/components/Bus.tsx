type BusProps = {
  x: number;
};

export function Bus({ x }: BusProps) {
  return (
    <img
      src="/sprites/bus.png"
      alt="Bus"
      style={{
        position: "absolute",
        bottom: "40px",
        left: x,
        width: "400px",
        height: "300px",
        imageRendering: "pixelated"
      }}
    />
  );
}
