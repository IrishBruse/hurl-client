/// <reference lib="dom" />

const iframe = document.getElementById("webview-patch-iframe");

let vscodeCache = null;

if (vscodeCache === null) {
    vscodeCache = window.acquireVsCodeApi();
}

const vscode = vscodeCache;

window.addEventListener("message", (e) => {
    if (e.data.__ID__ === "HotReloadProxy") {
        vscode.postMessage(e.data.data);
    }

    if (e.origin.startsWith("vscode-webview://")) {
        iframe.contentWindow.postMessage(e.data, "*");
    }
});

const styles = document.querySelector("html").style;

iframe.contentWindow.postMessage({ type: "asd", data: styles }, "*");
