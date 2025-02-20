import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const COLORS = ["yellow", "blue", "green", "pink", "orange"];

const Options = () => {
  const [selectedColor, setSelectedColor] = useState<string>("yellow");

  useEffect(() => {
    chrome.storage.local.get(["highlightColor"], (data) => {
      setSelectedColor(data.highlightColor || "yellow");
    });
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    chrome.storage.local.set({ highlightColor: color });
  };

  return (
    <div className="p-4 w-72">
      <h2 className="text-lg font-bold mb-2">하이라이트 색상 설정</h2>
      <div className="flex space-x-2">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`w-10 h-10 rounded-full border-2 ${
              selectedColor === color ? "border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color)}
          />
        ))}
      </div>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<Options />);
}
