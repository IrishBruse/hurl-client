import {
	createConnection,
	DidChangeConfigurationNotification,
	DocumentDiagnosticReportKind,
	DocumentFormattingRequest,
	ProposedFeatures,
	Range,
	TextDocuments,
	TextDocumentSyncKind,
	type CompletionItem,
	type DocumentDiagnosticReport,
	type InitializeParams,
	type InitializeResult,
	type TextDocumentPositionParams,
} from "vscode-languageserver/node";
import { URI } from "vscode-uri";

import { spawnSync } from "node:child_process";
import { TextDocument } from "vscode-languageserver-textdocument";
import { config, defaultSettings, type LspSettings } from "./config";
import { validateTextDocument } from "./validation";
import Parser = require("web-tree-sitter");
import path = require("node:path");

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	config.hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	config.hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	config.hasDiagnosticRelatedInformationCapability =
		!!capabilities.textDocument?.publishDiagnostics?.relatedInformation;

	config.hasFormattingCapability = !!capabilities.textDocument?.formatting;

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			completionProvider: {
				resolveProvider: true,
			},
			diagnosticProvider: {
				interFileDependencies: false,
				workspaceDiagnostics: false,
			},
		},
	};
	if (config.hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true,
			},
		};
	}
	return result;
});

connection.onInitialized(() => {
	InitTreeSitter();

	if (config.hasConfigurationCapability) {
		connection.client.register(
			DidChangeConfigurationNotification.type,
			undefined,
		);
	}
	if (config.hasFormattingCapability) {
		connection.client.register(DocumentFormattingRequest.type);
	}
	if (config.hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders((_event) => {
			connection.console.log("Workspace folder change event received.");
		});
	}
});

connection.onDidChangeConfiguration((change) => {
	if (config.hasConfigurationCapability) {
		config.documentSettings.clear();
	} else {
		config.settings = change.settings.languageServerExample || defaultSettings;
	}
	connection.languages.diagnostics.refresh();
});

documents.onDidClose((e) => {
	config.documentSettings.delete(e.document.uri);
});

export function getDocumentSettings(resource: string): Promise<LspSettings> {
	if (!config.hasConfigurationCapability) {
		return Promise.resolve(config.settings);
	}
	let result = config.documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: "languageServerExample",
		});
		config.documentSettings.set(resource, result);
	}
	return result;
}

connection.languages.diagnostics.on(async (params) => {
	const document = documents.get(params.textDocument.uri);
	if (document !== undefined) {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: await validateTextDocument(document),
		} satisfies DocumentDiagnosticReport;
	}
	return {
		kind: DocumentDiagnosticReportKind.Full,
		items: [],
	} satisfies DocumentDiagnosticReport;
});

documents.onDidChangeContent(({ document }) => {
	validateTextDocument(document);
});

connection.onDidChangeWatchedFiles((_change) => {
	console.log(_change.changes);

	connection.console.log("We received a file change event");
});

connection.onDocumentFormatting(async (params) => {
	const filePath = URI.parse(params.textDocument.uri).path;

	const command = `hurlfmt --no-color ${filePath}`;

	try {
		const process = spawnSync(command, { shell: true });

		if (process.status === 0) {
			const stdout = process.stdout.toString();
			const lines = stdout.split(/\r\n|\r|\n/).length;
			console.log(lines);

			return [{ newText: stdout, range: Range.create(0, 0, lines, 0) }];
		}
		console.log(process.status);
	} catch (err) {
		console.log(err);
	}
	return [];
});

connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		return [
			// {
			// 	label: "GET",
			// 	kind: CompletionItemKind.EnumMember,
			// 	data: 1,
			// },
			// {
			// 	label: "POST",
			// 	kind: CompletionItemKind.EnumMember,
			// 	data: 2,
			// },
		];
	},
);

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	if (item.data === 1) {
		item.detail = "TypeScript details";
		item.documentation = "TypeScript documentation";
	} else if (item.data === 2) {
		item.detail = "JavaScript details";
		item.documentation = "JavaScript documentation";
	}
	return item;
});

documents.listen(connection);
connection.listen();

function InitTreeSitter() {
	throw new Error("Function not implemented.");
}
