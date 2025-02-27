import * as path from "node:path";
import { workspace, type ExtensionContext } from "vscode";

import { LanguageClient, TransportKind, type LanguageClientOptions, type ServerOptions } from "vscode-languageclient/node";
import { HurlEditorProvider } from "./hurlEditor";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    context.subscriptions.push(HurlEditorProvider.register(context));

    const serverModule = context.asAbsolutePath(path.join("server", "out", "server.js"));

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
        },
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: "file", language: "hurl" }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };

    // Create the language client and start the client.
    client = new LanguageClient("hurl-lsp", "Hurl Language Server", serverOptions, clientOptions);

    // Start the client. This will also launch the server
    client.start();
}

export function deactivate(): Promise<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
