import * as vscode from "vscode";

/**
 * Provider for cat scratch editors.
 *
 * Cat scratch editors are used for `.cscratch` files, which are just json files.
 * To get started, run this extension and open an empty `.cscratch` file in VS Code.
 *
 * This provider demonstrates:
 *
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Synchronizing changes between a text document and a custom editor.
 */
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

	/** Called when our custom editor is opened. */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken,
	): Promise<void> {
		const extensionUri = this.context.extensionUri;

		// Setup initial content for the webview
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

		// Hook up event handlers so that we can synchronize the webview with the text document.
		//
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		//
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)

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
