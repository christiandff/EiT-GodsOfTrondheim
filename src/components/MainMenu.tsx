import { useEffect, useState } from "react";
import "../styles/MenuTitle.css";

export function MainMenu({ onStart }: { onStart: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="menu-root">
      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* Stars */}
      <div className="stars">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: Math.random() > 0.8 ? 3 : 2,
              height: Math.random() > 0.8 ? 3 : 2,
            }}
          />
        ))}
      </div>

      <div className={`menu-content ${visible ? "menu-visible" : ""}`}>
        {/* Top badge */}
        <div className="menu-badge">✦ EiT 2026 ✦</div>

        {/* Title block */}
        <div className="menu-title-block">
          <div className="menu-eyebrow">EKSPERTER I TEAM PRESENTS</div>
          <div className="menu-title">
            <span className="title-gods">GODS</span>
            <span className="title-of"> OF </span>
            <span className="title-trondheim">TRONDHEIM</span>
          </div>
          <div className="menu-subtitle-line">
            <span className="line-decoration">▓▓▓</span>
            <span className="menu-tagline">A KARMIC JOURNEY THROUGH THE CITY</span>
            <span className="line-decoration">▓▓▓</span>
          </div>
        </div>

        {/* Controls hint */}
        <div className="menu-controls">
          <div className="controls-row">
            <kbd>A</kbd><kbd>D</kbd> Move
            <span className="controls-sep">·</span>
            <kbd>SPACE</kbd> Jump
            <span className="controls-sep">·</span>
            <kbd>E</kbd> Interact
            <span className="controls-sep">·</span>
            <kbd>ESC</kbd> Pause
          </div>
        </div>

        {/* Start button */}
        <button className="menu-start-btn" onClick={onStart}>
          <span className="btn-arrow">▶</span> START GAME
        </button>

        <div className="menu-enter-hint">— or press ENTER —</div>

        {/* Version tag */}
        <div className="menu-version">v1.0.0 · TRONDHEIM BUILD</div>
      </div>
    </div>
  );
}
