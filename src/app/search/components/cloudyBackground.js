import React from "react";

export default function CloudyBackground() {
  const clouds = Array.from({ length: 20 }); // 20 Wolken generieren

  return (
    <div className="bg-cloudy">
      {clouds.map((_, index) => (
        <span
          key={index}
          className="cloud"
          style={{
            "--random-x": Math.random(), // Zufällige horizontale Position
            "--random-y": Math.random() * 0.5, // Zufällige vertikale Position (oberer Bereich des Bildschirms)
          }}
        >
          ☁️
        </span>
      ))}
    </div>
  );
}
