
const CACHE = "reis-estatico-v4";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./admin.js",
    "./animacoes.js",
    "./cinema.js",
    "./manifest.webmanifest"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE)
            .then(async cache => {
                await Promise.allSettled(
                    ARQUIVOS.map(arquivo => cache.add(arquivo))
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(async nomes => {
            await Promise.all(
                nomes
                    .filter(nome =>
                        nome.startsWith("reis-estatico-") &&
                        nome !== CACHE
                    )
                    .map(nome => caches.delete(nome))
            );

            await self.clients.claim();
        })
    );
});

self.addEventListener("fetch", event => {
    const req = event.request;
    const url = new URL(req.url);

    if (
        req.method !== "GET" ||
        url.origin !== self.location.origin
    ) {
        return;
    }

    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req).catch(() => caches.match("./index.html"))
        );
        return;
    }

    // CSS e JS sempre atualizados.
    if (/\.(css|js)$/.test(url.pathname)) {
        event.respondWith(
            fetch(req).catch(() => caches.match(req))
        );
        return;
    }

    event.respondWith(
        caches.match(req).then(
            resposta => resposta || fetch(req)
        )
    );
});
