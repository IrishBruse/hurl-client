import * as vscode from "vscode";
import { parseHurl } from "hurl-js-parser";

export class HurlEditorProvider implements vscode.CustomTextEditorProvider {
    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new HurlEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(HurlEditorProvider.viewType, provider, {
            webviewOptions: {
                enableFindWidget: true,
                retainContextWhenHidden: true,
            },
        });
        return providerRegistration;
    }

    private static readonly viewType = "hurl.hurlEditor";

    constructor(private readonly context: vscode.ExtensionContext) {}

    public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
        const extensionUri = this.context.extensionUri;

        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, "out"), vscode.Uri.joinPath(extensionUri, "hurlEditor/build")],
        };

        webviewPanel.webview.html = getReactEntry(webviewPanel.webview, this.context.extensionUri);

        function updateWebview() {
            const hurl = parseHurl(document.getText());
            if (hurl.sucess === true) {
                webviewPanel.webview.postMessage({
                    type: "update",
                    source: "hurl-editor",
                    text: JSON.stringify(hurl.data),
                });
            }
        }
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });

        // Make sure we get rid of the listener when our editor is closed.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        // Receive message from the webview.
        webviewPanel.webview.onDidReceiveMessage((e) => {
            // Check if the webview signals that it is ready
            if (e.command === "appReady") {
                updateWebview();
                return;
            }
        });
    }
}

function getReactEntry(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, ["hurlEditor", "build", "hurl-editor.js"]);
    const cssUri = getUri(webview, extensionUri, ["hurlEditor", "build", "hurl-editor.css"]);

    const nonce = getNonce();

    return `
      <html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta http-equiv="Content-Security-Policy"
					content="default-src 'none';
					img-src vscode-resource: https:;
                    font-src ${webview.cspSource};
					style-src ${webview.cspSource} 'unsafe-inline';
					script-src 'nonce-${nonce}' 'unsafe-inline';
					">
                <link rel="stylesheet" href="${cssUri}" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body>
				<div id="root"></div>
				<script type="module" defer nonce="${nonce}" src="${scriptUri}"></script>
			</body>
      </html>
    `;
}

export function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathList: string[]) {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}

export function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
