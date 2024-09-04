document.addEventListener('DOMContentLoaded', async () => {
    const chromeTabsContainer = document.querySelector('.chrome-tabs');
    const chromeTabs = new ChromeTabs();
    chromeTabs.init(chromeTabsContainer);

    const backButton = document.getElementById('back-button');
    const forwardButton = document.getElementById('forward-button');
    const reloadButton = document.getElementById('reload-button');
    const addressBar = document.getElementById('address-bar');
    const tabsContent = document.querySelector('.tabs-content');

    let tabs = [];
    let currentTab = null;

    function createTab(url = 'https://example.com') {
        const proxiedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
        const tabId = `tab-${tabs.length + 1}`;

        // Add new tab to ChromeTabs
        chromeTabs.addTab({
            title: `Tab ${tabs.length + 1}`,
            id: tabId,
        });

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = proxiedUrl;
        iframe.dataset.realsrc = url;
        iframe.dataset.tab = tabId;

        // Add iframe to tabs content
        tabsContent.appendChild(iframe);

        // Save tab info
        tabs.push({
            id: tabId,
            iframe: iframe
        });

        // Set as current tab
        setCurrentTab(tabId);

        // Event listener for tab click to set current tab
        chromeTabsContainer.querySelector(`[data-tab-id="${tabId}"]`).addEventListener('click', () => setCurrentTab(tabId));
    }

    function setCurrentTab(tabId) {
        tabs.forEach(tab => {
            if (tab.id === tabId) {
                currentTab = tab;
                addressBar.value = tab.iframe.dataset.realsrc;
                tab.iframe.style.display = 'block';
            } else {
                tab.iframe.style.display = 'none';
            }
        });
    }

    function navigateTo(url) {
        if (!url.startsWith('https') && !url.startsWith('ftp') && !url.startsWith('http')) {
            url = `https://${url}`;
        }
        if (currentTab) {
            currentTab.iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
            currentTab.iframe.dataset.realsrc = url;
            addressBar.value = currentTab.iframe.dataset.realsrc;
        }
    }

    // Navigation buttons
    backButton.addEventListener('click', () => {
        if (currentTab) currentTab.iframe.contentWindow.history.back();
    });

    forwardButton.addEventListener('click', () => {
        if (currentTab) currentTab.iframe.contentWindow.history.forward();
    });

    reloadButton.addEventListener('click', () => {
        if (currentTab) currentTab.iframe.src = currentTab.iframe.src;
    });

    addressBar.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            navigateTo(addressBar.value);
        }
    });

    // Add tab button listener
    await registerSW();

    // Initialize with one tab
    createTab();
});
