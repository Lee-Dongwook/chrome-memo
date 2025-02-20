const getHighlightColor = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["highlightColor"], (data) => {
      resolve(data.highlightColor || "yellow");
    });
  });
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

  span.onclick = () => {
    const note = prompt("메모를 입력하세요:");
    if (note) {
      span.setAttribute("data-note", note);
      alert(`메모 저장됨: ${note}`);
    }
  };

  range.deleteContents();
  range.insertNode(span);
};

document.addEventListener("mouseup", () => {
  highlightSelection();
});
