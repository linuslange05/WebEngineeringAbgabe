import React from "react";

export default function ThunderBackground() {
  // Anzahl der Blitze
  const lightningCount = 5;

  // Zufällige Positionen und Verzögerungen für die Blitze
  const lightningElements = Array.from({ length: lightningCount }).map((_, index) => {
    const randomX = Math.random();
    const randomY = Math.random();
    const randomDelay = Math.random() * 2; // Verzögerung von bis zu 2 Sekunden

    return (
      <span
        key={index}
        className="lightning"
        style={{
          "--random-x": randomX,
          "--random-y": randomY,
          "--random-delay": `${randomDelay}s`,
        }}
      >
        ⚡
      </span>
    );
  });

  return <div className="bg-thunderstorm">{lightningElements}</div>;
}
