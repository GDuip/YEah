importScripts('/epoxy/index.js');
importScripts('/ultraviolet/uv.bundle.js');
importScripts('/ultraviolet/uv.config.js');
importScripts('/ultraviolet/uv.sw.js');
importScripts('/workerware/index.js');
const ww = new WorkerWare({
    debug: true,
});

ww.use({
  function: self.adblockExt.filterRequest,
  events: ["fetch"],
  name: "Adblock",
});

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));
