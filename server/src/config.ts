export interface LspSettings {
	maxNumberOfProblems: number;
}

export const defaultSettings: LspSettings = {
	maxNumberOfProblems: 1000,
};

export const config = {
	hasConfigurationCapability: false,
	hasWorkspaceFolderCapability: false,
	hasDiagnosticRelatedInformationCapability: false,
	hasFormattingCapability: false,
	settings: defaultSettings,
	documentSettings: new Map<string, Promise<LspSettings>>(),
};
