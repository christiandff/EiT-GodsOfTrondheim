type SceneTransitionProps = {
  videoSrc: string;
  onDone: () => void;
};

export function SceneTransition({ videoSrc, onDone }: SceneTransitionProps) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      background: "#000",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <video
        src={videoSrc}
        autoPlay
        onEnded={onDone}
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
        }}
      />
      <button
        onClick={onDone}
        style={{
          position: "absolute",
          bottom: "5%",
          right: "4%",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9,
          color: "#7799bb",
          background: "#0d1a2e",
          border: "1px solid #334466",
          padding: "8px 16px",
          cursor: "pointer",
          letterSpacing: 1,
          zIndex: 101,
        }}
      >
        SKIP ▶▶
      </button>
    </div>
  );
}
