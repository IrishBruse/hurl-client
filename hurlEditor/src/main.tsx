import { createRoot } from "react-dom/client";

import "./main.css";
import { App } from "./App";
import { WebviewApi } from "vscode-webview";

let vscodeCache: WebviewApi<unknown> = null!;

if (vscodeCache === null) {
    if (!window.acquireVsCodeApi) {
        vscodeCache = {
            postMessage: (message: unknown) => {
                console.info("%cpostMessage", "font-weight:bold", message);
            },
            getState: () => {
                return;
            },
            setState<T extends unknown | undefined>(newState: T): T {
                return newState;
            },
        };
    } else {
        vscodeCache = window.acquireVsCodeApi();
    }
}

export const vscode = vscodeCache;

if (!window.reactRoot) {
    window.reactRoot = createRoot(document.getElementById("root")!);
}

window.reactRoot.render(<App />);
