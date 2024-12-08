import React from "react";

export default function RainBackground({type}) {
  let drops = Array.from({ length: 50 }); // 50 Regentropfen generieren
  if(type == "light"){
    drops = Array.from({ length: 20 }); // 25 Regentrop
  }
  return (
    <div className="bg-rain">
      {drops.map((_, index) => (
        <span
          key={index}
          className="rain-drop"
          style={{
            "--random-x": Math.random(), // Zufällige horizontale Position
            "--random-delay": `${Math.random() * 2}s`, // Zufällige Verzögerung von bis zu 2 Sekunden
          }}
        >
          💧
        </span>
      ))}
    </div>
  );
}
