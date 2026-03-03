export function KarmaBar({ karma }) {
  const maxKarma = 100;
  const percent = Math.min(karma, maxKarma);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
        zIndex: 1000
      }}
    >
      {/* Selve baren */}
      <div
        style={{
          width: 200,
          height: 20,
          backgroundColor: "#222",
          border: "3px solid #555",
          borderRadius: 2,
          overflow: "hidden",
          imageRendering: "pixelated"
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor: "#00cc66",
            transition: "width 0.2s steps(4)",
            imageRendering: "pixelated"
          }}
        />
      </div>

      {/* Pixelert tekst */}
      <div
        style={{
          color: "white",
          fontSize: 12,
          fontFamily: "'Press Start 2P', monospace",
          letterSpacing: 1,
          textShadow: "2px 2px #000",
          imageRendering: "pixelated",
          WebkitFontSmoothing: "none",
          MozOsxFontSmoothing: "unset"
        }}
      >
        KARMABAR
      </div>
    </div>
  );
}
