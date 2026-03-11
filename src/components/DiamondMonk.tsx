type DiamondMonkProps = {
  x: number;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
};

export function DiamondMonk({ x }: DiamondMonkProps) {
=======
  flipped: boolean;
  
};

export function DiamondMonk({ x, flipped, }: DiamondMonkProps) {
>>>>>>> Stashed changes
=======
  flipped: boolean;
  
};

export function DiamondMonk({ x, flipped, }: DiamondMonkProps) {
>>>>>>> Stashed changes
=======
  flipped: boolean;
  
};

export function DiamondMonk({ x, flipped, }: DiamondMonkProps) {
>>>>>>> Stashed changes
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
