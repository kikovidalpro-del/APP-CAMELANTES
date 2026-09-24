/* Registra el service worker (modo sin conexión). Va en un archivo aparte porque la CSP no permite scripts en línea. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
