chrome.runtime.onInstalled.addListener(() => {
  console.log("Highlight Note 익스텐션 설치됨!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_HIGHLIGHTS") {
    chrome.storage.local.get(["highlights"], (data) => {
      sendResponse({ highlights: data.highlights || [] });
    });
    return true;
  }
});
