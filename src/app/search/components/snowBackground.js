import React from "react";

export default function SnowBackground({type}) {
  let snowflakes = Array.from({ length: 50 }); // 50 Schneeflocken generieren
    if(type == "light"){
        snowflakes = Array.from({ length: 20 }); // 20 Schneeflocken generieren
    }
  return (
    <div className="bg-snow">
      {snowflakes.map((_, index) => (
        <span
          key={index}
          className="snowflake"
          style={{
            "--random-x": Math.random(), // Zufällige horizontale Position
            "--random-delay": `${Math.random() * 3}s`, // Zufällige Verzögerung
          }}
        >
          ❄️
        </span>
      ))}
    </div>
  );
}
