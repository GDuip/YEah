document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('back-button');
    const forwardButton = document.getElementById('forward-button');
    const reloadButton = document.getElementById('reload-button');
    const addressBar = document.getElementById('address-bar');
    const iframeViewer = document.getElementById('iframe-viewer');

    let historyStack = [];
    let historyIndex = -1;

    function navigateTo(url) {
        if (!url.startsWith('http')) {
            url = `http://${url}`;
        }
        iframeViewer.src = url;
        if (historyIndex === -1 || historyStack[historyIndex] !== url) {
            historyStack = historyStack.slice(0, historyIndex + 1);
            historyStack.push(url);
            historyIndex++;
        }
        addressBar.value = url;
    }

    backButton.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            iframeViewer.src = historyStack[historyIndex];
            addressBar.value = historyStack[historyIndex];
        }
    });

    forwardButton.addEventListener('click', () => {
        if (historyIndex < historyStack.length - 1) {
            historyIndex++;
            iframeViewer.src = historyStack[historyIndex];
            addressBar.value = historyStack[historyIndex];
        }
    });

    reloadButton.addEventListener('click', () => {
        iframeViewer.src = addressBar.value;
    });

    addressBar.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            navigateTo(addressBar.value);
        }
    });
});
