import { saveHighlight, removeHighlight, getHighlights } from "./storage";

const getHighlightColor = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["highlightColor"], (data) => {
      resolve(data.highlightColor || "yellow");
    });
  });
};

const applyHighlight = async (text: string, color: string) => {
  const spans = document.querySelectorAll("span");
  for (const span of spans) {
    if (span.textContent === text) return;
  }

  const range = document.createRange();
  const selection = window.getSelection();
  if (!selection) return;

  const nodes = document.body.childNodes;
  for (const node of nodes) {
    if (node.textContent?.includes(text)) {
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
      highlightSelection();
      break;
    }
  }
};

const highlightSelection = async () => {
  const selection = window.getSelection();
  if (!selection?.toString().trim()) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");

  const highlightColor = await getHighlightColor();
  span.style.backgroundColor = highlightColor;
  span.style.color = "black";
  span.style.padding = "2px 4px";
  span.style.borderRadius = "4px";
  span.style.cursor = "pointer";
  span.textContent = selection.toString();

  span.onclick = async () => {
    const confirmDelete = confirm("삭제하시겠습니까?");
    if (confirmDelete) {
      span.remove();
      await removeHighlight(selection.toString());
    }
  };

  range.deleteContents();
  range.insertNode(span);

  await saveHighlight(selection.toString(), highlightColor);
};

const restoreHighlights = async () => {
  const highlights = await getHighlights();
  highlights.forEach(({ text, color }) => {
    applyHighlight(text, color);
  });
};

window.onload = () => {
  restoreHighlights();
};

document.addEventListener("mouseup", () => {
  highlightSelection();
});
