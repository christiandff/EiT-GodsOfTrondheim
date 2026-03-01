export function Scene({ background, playerX, children }) {
  return (
    <div
      style={{
        position: "relative",
        width: "3000px",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        transform: `translateX(${-playerX}px)`,
        transition: "transform 0.02s linear"
      }}
    >
      {children}
    </div>
  );
}
