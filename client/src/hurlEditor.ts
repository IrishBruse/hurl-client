import * as vscode from "vscode";

export class HurlEditorProvider implements vscode.CustomTextEditorProvider {
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new HurlEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(
			HurlEditorProvider.viewType,
			provider,
			{ webviewOptions: { enableFindWidget: true } },
		);
		return providerRegistration;
	}

	private static readonly viewType = "hurl.hurlEditor";

	constructor(private readonly context: vscode.ExtensionContext) {}

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken,
	): Promise<void> {
		const extensionUri = this.context.extensionUri;

		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(extensionUri, "out"),
				vscode.Uri.joinPath(extensionUri, "hurlEditor/build"),
			],
		};

		webviewPanel.webview.html = getReactEntry(
			webviewPanel.webview,
			this.context.extensionUri,
		);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: "update",
				text: document.getText(),
			});
		}
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
			(e) => {
				if (e.document.uri.toString() === document.uri.toString()) {
					updateWebview();
				}
			},
		);

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage((e) => {
			console.log(e);

			switch (e.type) {
				case "add":
					console.log("add");
					return;

				case "delete":
					return;
			}
		});

		updateWebview();
	}
}

function getReactEntry(
	webview: vscode.Webview,
	extensionUri: vscode.Uri,
): string {
	// The CSS file from the React build output
	const stylesUri = getUri(webview, extensionUri, [
		"hurlEditor",
		"build",
		"assets",
		"index.css",
	]);
	// The JS file from the React build output
	const scriptUri = getUri(webview, extensionUri, [
		"hurlEditor",
		"build",
		"assets",
		"index.js",
	]);

	const nonce = getNonce();

	return `
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
}

export function getUri(
	webview: vscode.Webview,
	extensionUri: vscode.Uri,
	pathList: string[],
) {
	return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}

export function getNonce() {
	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
