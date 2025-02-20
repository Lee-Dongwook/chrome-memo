import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

interface Highlight {
  text: string;
  color: string;
}

const Popup = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    chrome.storage.local.get("highlights", (data) => {
      setHighlights(data.highlights || []);
    });
  }, []);

  return (
    <div className="p-4 w-64">
      <h2 className="text-lg font-bold mb-2">하이라이트 목록</h2>
      <ul>
        {highlights.length > 0 ? (
          highlights.map((h, idx) => (
            <li key={idx} className="mt-2 p-2 border rounded bg-yellow-200">
              {h.text}
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
