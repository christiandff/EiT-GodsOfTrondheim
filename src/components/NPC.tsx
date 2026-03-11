type NPCProps = {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  x: number;
};

export function NPC({ x }: NPCProps) {
=======
  x: number;           // actual world position (controlled by App)
  flipped: boolean;
  
};

export function NPC({ x, flipped, }: NPCProps) {
>>>>>>> Stashed changes
=======
  x: number;           // actual world position (controlled by App)
  flipped: boolean;
  
};

export function NPC({ x, flipped, }: NPCProps) {
>>>>>>> Stashed changes
  return (
    <img
      src="/sprites/NPC.png"
      alt="NPC"
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
