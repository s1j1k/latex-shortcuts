// TODO turn into test case
const typed = "\beg";
// want to expand to \begin{env} \end{env}
// want to allow user to type in the env, hit enter and get the
// cursor in the middle
// all without leaving the window
const env = "env"; // TODO listen to what the user types
const result = `\begin{${env}} <cursor here> \end{${env}}`;

// function reddenPage() {
//     document.body.style.backgroundColor = 'red';
//   }

function doShortCut() {
  var el = document.activeElement; // or some other element reference
  console.log(el)
  var text = el?.textContent //el?.innerText || el?.textContent;
  console.log(text);
}

// runs on shortcut and runs on Ctrl+B
chrome.action.onClicked.addListener((tab) => {
  if (!tab.url?.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id ?? -1 },
      func: doShortCut,
    });
  }
});
