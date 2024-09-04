document.addEventListener('DOMContentLoaded', async () => {
    const backButton = document.getElementById('back-button');
    const forwardButton = document.getElementById('forward-button');
    const reloadButton = document.getElementById('reload-button');
    const addressBar = document.getElementById('address-bar');
    const chromeTabsContainer = document.querySelector('.chrome-tabs');
    const tabsContent = document.querySelector('.tabs-content');

    const chromeTabs = new ChromeTabs();
    chromeTabs.init(chromeTabsContainer);

    let tabs = [];
    let currentTab = null;

    function createTab(url = 'https://example.com') {
        const proxiedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
        const tabId = `tab-${tabs.length + 1}`;

        // Add new tab in ChromeTabs
        chromeTabs.addTab({
            title: `Tab ${tabs.length + 1}`,
            favicon: '' // Add favicon URL if available
        });

        const tabElement = chromeTabsContainer.querySelector('.chrome-tab:last-child');

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = proxiedUrl;
        iframe.dataset.realsrc = url;
        iframe.dataset.tab = tabId;
        iframe.style.display = 'none'; // Hidden by default, only show the active tab

        tabsContent.appendChild(iframe);

        // Save tab info
        tabs.push({
            id: tabId,
            iframe: iframe,
            tabElement: tabElement
        });

        // Set the new tab as the current tab
        setCurrentTab(tabId);

        // Add event listener to ChromeTab
        tabElement.addEventListener('click', () => setCurrentTab(tabId));

        // Add close functionality
        tabElement.querySelector('.chrome-tab-close').addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the tab switch
            closeTab(tabId);
        });
    }

    function setCurrentTab(tabId) {
        tabs.forEach(tab => {
            if (tab.id === tabId) {
                tab.iframe.style.display = 'block';
                tab.tabElement.classList.add('chrome-tab-current');
                currentTab = tab;
                addressBar.value = tab.iframe.dataset.realsrc;
            } else {
                tab.iframe.style.display = 'none';
                tab.tabElement.classList.remove('chrome-tab-current');
            }
        });
    }

    function closeTab(tabId) {
        const tabIndex = tabs.findIndex(tab => tab.id === tabId);

        if (tabIndex > -1) {
            const tab = tabs[tabIndex];
            tab.iframe.remove(); // Remove the iframe
            tab.tabElement.remove(); // Remove the tab element from ChromeTabs

            tabs.splice(tabIndex, 1); // Remove tab from the tabs array

            if (tabs.length > 0) {
                // If there are remaining tabs, set the previous tab as the current tab
                const newCurrentTabId = tabs[Math.max(tabIndex - 1, 0)].id;
                setCurrentTab(newCurrentTabId);
            } else {
                currentTab = null;
                addressBar.value = '';
            }
        }
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

    chromeTabsContainer.querySelector('.chrome-tabs-button--add').addEventListener('click', () => createTab());

    await registerSW();
    createTab(); // Initialize with one tab
});
