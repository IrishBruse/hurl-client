import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	const webview = vscode.commands.registerCommand(
		"yourExtensionName.start",
		() => {
			const panel = vscode.window.createWebviewPanel(
				"webview",
				"React",
				vscode.ViewColumn.One,
				{
					enableScripts: true,
				},
			);

			// web is for my react root directory, rename for yours

			const scriptSrc = panel.webview.asWebviewUri(
				vscode.Uri.joinPath(context.extensionUri, "web", "dist", "index.js"),
			);

			const cssSrc = panel.webview.asWebviewUri(
				vscode.Uri.joinPath(context.extensionUri, "web", "dist", "index.css"),
			);

			// Watch the dist directory for changes
			const watcher = vscode.workspace.createFileSystemWatcher(
				new vscode.RelativePattern(context.extensionUri, "web/dist/*"),
			);
			vscode.commands.executeCommand(
				"workbench.action.webview.reloadWebviewAction",
			);
			// React to changes in the dist directory
			watcher.onDidChange(() => {
				vscode.commands.executeCommand(
					"workbench.action.webview.reloadWebviewAction",
				);
			});
			watcher.onDidCreate(() => {
				vscode.commands.executeCommand(
					"workbench.action.webview.reloadWebviewAction",
				);
			});
			watcher.onDidDelete(() => {
				vscode.commands.executeCommand(
					"workbench.action.webview.reloadWebviewAction",
				);
			});

			panel.webview.html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <link rel="stylesheet" href="${cssSrc}" />
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script src="${scriptSrc}"></script>
          </body>
        </html>
        `;
		},
	);

	context.subscriptions.push(webview);
}

export function deactivate() {}
