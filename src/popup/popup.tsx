import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getHighlights, removeHighlight } from "../storage";

interface Highlight {
  id: number;
  text: string;
  color: string;
}

const Popup = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    getHighlights().then(setHighlights);
  }, []);

  const deleteHighlight = async (id: number) => {
    await removeHighlight(highlights.find((h) => h.id === id)?.text || "");
    setHighlights(await getHighlights());
  };

  return (
    <div className="p-4 w-64">
      <h2 className="text-lg font-bold mb-2">하이라이트 목록</h2>
      <ul>
        {highlights.length > 0 ? (
          highlights.map((h) => (
            <li
              key={h.id}
              className="mt-2 p-2 border rounded"
              style={{ backgroundColor: h.color }}
            >
              {h.text}
              <button
                className="text-red-500 font-bold"
                onClick={() => deleteHighlight(h.id)}
              >
                ✕
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">저장된 하이라이트가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<Popup />);
}
