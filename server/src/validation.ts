import type { TextDocument } from "vscode-languageserver-textdocument";
import {
	DiagnosticSeverity,
	type Diagnostic,
} from "vscode-languageserver-types";
import { config } from "./config";
import { getDocumentSettings } from "./server";

export async function validateTextDocument(
	textDocument: TextDocument,
): Promise<Diagnostic[]> {
	// In this simple example we get the settings for every validate run.
	const settings = await getDocumentSettings(textDocument.uri);

	// The validator creates diagnostics for all uppercase words length 2 and more
	const text = textDocument.getText();
	const pattern = /\b[A-Z]{2,}\b/g;

	let problems = 0;
	const diagnostics: Diagnostic[] = [];
	const m: RegExpExecArray | null = pattern.exec(text);
	while (m && problems < settings.maxNumberOfProblems) {
		problems++;
		const diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length),
			},
			message: `${m[0]} is all uppercase.`,
			source: "ex",
		};
		if (config.hasDiagnosticRelatedInformationCapability) {
			diagnostic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range),
					},
					message: "Spelling matters",
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range),
					},
					message: "Particularly for names",
				},
			];
		}
		diagnostics.push(diagnostic);
	}
	return diagnostics;
}
