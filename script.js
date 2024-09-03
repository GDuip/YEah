const backButton = document.getElementById('back-button');
const forwardButton = document.getElementById('forward-button');
const addressBar = document.getElementById('address-bar');
const goButton = document.getElementById('go-button');
const iframeViewer = document.getElementById('iframe-viewer');

let historyStack = [];
let historyIndex = -1;

function navigateTo(url) {
    if (url && url !== '') {
        iframeViewer.src = url.startsWith('http') ? url : `http://${url}`;
        historyStack = historyStack.slice(0, historyIndex + 1);
        historyStack.push(url);
        historyIndex++;
    }
}

goButton.addEventListener('click', () => {
    const url = addressBar.value;
    navigateTo(url);
});

backButton.addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        const url = historyStack[historyIndex];
        addressBar.value = url;
        iframeViewer.src = url;
    }
});

forwardButton.addEventListener('click', () => {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        const url = historyStack[historyIndex];
        addressBar.value = url;
        iframeViewer.src = url;
    }
});

addressBar.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const url = addressBar.value;
        navigateTo(url);
    }
});
