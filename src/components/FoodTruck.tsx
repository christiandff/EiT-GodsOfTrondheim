type FoodTruckProps = {
  x: number;
};

export function FoodTruck({ x }: FoodTruckProps) {
  return (
    <img
      src="/sprites/foodtruck.png"
      alt="Food Truck"
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
