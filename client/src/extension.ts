import * as path from "node:path";
import {
	type NotebookSerializer,
	workspace,
	type ExtensionContext,
	type NotebookData,
	type CancellationToken,
	type NotebookCellData,
} from "vscode";

import {
	LanguageClient,
	TransportKind,
	type LanguageClientOptions,
	type ServerOptions,
} from "vscode-languageclient/node";
import { HurlEditorProvider } from "./hurlEditor";
import {
	parseMarkdown,
	writeCellsToMarkdown,
	type RawNotebookCell,
} from "./notebook/markdownParser";

let client: LanguageClient;

const providerOptions = {
	transientMetadata: {
		runnable: true,
		editable: true,
		custom: true,
	},
	transientOutputs: true,
};

export function activate(context: ExtensionContext) {
	context.subscriptions.push(HurlEditorProvider.register(context));

	context.subscriptions.push(
		workspace.registerNotebookSerializer(
			"hurl-notebook-renderer",
			new MarkdownProvider(),
			providerOptions,
		),
	);

	const serverModule = context.asAbsolutePath(
		path.join("server", "out", "server.js"),
	);

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
	client = new LanguageClient(
		"hurl-lsp",
		"Hurl Language Server",
		serverOptions,
		clientOptions,
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Promise<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

class MarkdownProvider implements NotebookSerializer {
	private readonly decoder = new TextDecoder();
	private readonly encoder = new TextEncoder();

	deserializeNotebook(
		data: Uint8Array,
		_token: CancellationToken,
	): NotebookData | Thenable<NotebookData> {
		const content = this.decoder.decode(data);

		const cellRawData = parseMarkdown(content);
		const cells = cellRawData.map(rawToNotebookCellData);

		return {
			cells,
		};
	}

	serializeNotebook(
		data: NotebookData,
		_token: CancellationToken,
	): Uint8Array | Thenable<Uint8Array> {
		const stringOutput = writeCellsToMarkdown(data.cells);
		return this.encoder.encode(stringOutput);
	}
}

export function rawToNotebookCellData(data: RawNotebookCell): NotebookCellData {
	return {
		kind: data.kind,
		languageId: data.language,
		metadata: {
			leadingWhitespace: data.leadingWhitespace,
			trailingWhitespace: data.trailingWhitespace,
			indentation: data.indentation,
		},
		outputs: [],
		value: data.content,
	};
}
