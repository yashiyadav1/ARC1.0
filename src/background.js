chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleARC
  });
});

function toggleARC() {
  if (typeof window.arcEnabled === 'undefined') {
    window.arcEnabled = false;
  }
  
  window.arcEnabled = !window.arcEnabled;
  
  if (window.arcEnabled) {
    modifyText(document.body);
    addArcStyles();
  } else {
    location.reload();
  }
}

function modifyText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let modifiedText = node.textContent.replace(/\b[a-zA-Z]+\b/g, function(word) {
      if (word.length >= 3) {
        let boldLength = word.length > 3 ? 2 : 1;
        return `<span class="arc-bold">${word.slice(0, boldLength)}</span>${word.slice(boldLength)}`;
      }
      return word;
    });
    
    let span = document.createElement('span');
    span.innerHTML = modifiedText;
    node.parentNode.replaceChild(span, node);
  } else {
    for (let child of node.childNodes) {
      modifyText(child);
    }
  }
}

function addArcStyles() {
  let style = document.createElement('style');
  style.textContent = `
    .arc-bold {
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
}