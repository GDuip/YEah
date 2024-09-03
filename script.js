document.addEventListener('DOMContentLoaded', async () => {
    const backButton = document.getElementById('back-button');
    const forwardButton = document.getElementById('forward-button');
    const reloadButton = document.getElementById('reload-button');
    const addressBar = document.getElementById('address-bar');
    const newTabButton = document.getElementById('new-tab-button');
    const tabsBar = document.querySelector('.tabs-bar');
    const tabsContent = document.querySelector('.tabs-content');

    let tabs = [];
    let currentTab = null;

    function createTab(url = __uv$config.prefix + __uv$config.encodeUrl('https://example.com')) {
        const tabId = `tab-${tabs.length + 1}`;

        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.classList.add('tab-button');
        tabButton.textContent = `Tab ${tabs.length + 1}`;
        tabButton.dataset.tab = tabId;

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.dataset.tab = tabId;

        // Add to tabs bar and tabs content
        tabsBar.insertBefore(tabButton, newTabButton);
        tabsContent.appendChild(iframe);

        // Save tab info
        tabs.push({ id: tabId, button: tabButton, iframe: iframe });

        // Set as current tab
        setCurrentTab(tabId);

        // Add event listener to tab button
        tabButton.addEventListener('click', () => setCurrentTab(tabId));
    }

    function setCurrentTab(tabId) {
        tabs.forEach(tab => {
            if (tab.id === tabId) {
                tab.button.classList.add('active');
                tab.iframe.style.display = 'block';
                currentTab = tab;
                addressBar.value = tab.iframe.src;
            } else {
                tab.button.classList.remove('active');
                tab.iframe.style.display = 'none';
            }
        });
    }

    function navigateTo(url) {
        if (!url.startsWith('https')) {
            url = `https://${url}`;
        }
        if (currentTab) {
            currentTab.iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
            addressBar.value = url;
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

    newTabButton.addEventListener('click', () => createTab());

    await registerSW();
    // Initialize with one tab
    createTab();
});
