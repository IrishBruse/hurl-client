import path = require("node:path");
import fs = require("node:fs");
import Parser = require("web-tree-sitter");

let parser: Parser | null = null;
async function InitTreeSitter() {
	await Parser.init();
	parser = new Parser();
	const langFile = path.join(__dirname, "../", "tree-sitter-hurl.wasm");
	const Hurl = await Parser.Language.load(langFile);
	parser.setLanguage(Hurl);

	const tree = parser.parse(
		fs.readFileSync("/home/econn/git/hurl-client/test/grammer.hurl", "ascii"),
	).rootNode;

	recursiveWalk(tree, 0);

	console.log();

	entries(tree);
}

function recursiveWalk(tree: Parser.SyntaxNode, depth: number) {
	const spaces = " ".repeat(depth);
	for (const node of tree.children) {
		if (node.type === "\n" || node.type === "lt") {
			continue;
		}
		console.log(spaces + node.type);
		recursiveWalk(node, depth + 1);
	}
}

type Request = {
	method?: string;
	url?: string;
	headers: Record<string, string>;
	requestSections: Record<string, Record<string, string>>;
};

type Response = {
	version?: string;
	status?: string;
	headers: Record<string, string>;
	responseSections: Record<string, Record<string, string>>;
};

type Entry = {
	request: Request;
	response?: Response;
};

function entries(tree: Parser.SyntaxNode) {
	const entries: Entry[] = [];
	for (const entry of tree.children) {
		const request: Request = {
			headers: {},
			requestSections: {},
		};

		const response: Response = {
			headers: {},
			responseSections: {},
		};

		for (const node of entry.children) {
			// request:
			//   lt*
			//   method sp value-string lt
			//   header*
			//   request-section*
			//   body?
			if (node.type === "request") {
				for (const reqChild of node.children) {
					const type = reqChild.type.replace("\n", "\\n");

					if (type === "method") {
						request.method = reqChild.text;
					} else if (type === "value_string") {
						request.url = reqChild.text;
					} else if (type === "header") {
						const kv = reqChild.children[0];
						const key = kv.children[0].text;
						const value = kv.children[2].text.trim();
						request.headers[key] = value;
					} else if (type === "request_section") {
						parseRequestSection(reqChild, request);
					} else if (type === "lt") {
						// comment
					} else if (type === "\\n") {
						// newline
					} else {
						console.log("Unknown Type:", type);
					}
				}

				console.log(request);
			}

			// response:
			//   lt*
			//   version sp status lt
			//   header*
			//   response-section*
			//   body?
			if (node.type === "response") {
				for (const reqChild of node.children) {
					const type = reqChild.type.replace("\n", "\\n");

					if (type === "version") {
						response.version = reqChild.text;
					} else if (type === "status") {
						response.status = reqChild.text;
					} else if (type === "header") {
						const kv = reqChild.children[0];
						const key = kv.children[0].text;
						const value = kv.children[2].text.trim();
						response.headers[key] = value;
					} else if (type === "response_section") {
						parseResponseSection(reqChild, response);
					} else if (type === "lt") {
						// comment
					} else if (type === "\\n") {
						// newline
					} else {
						console.log("Unknown Type:", type);
					}
				}

				console.log(response);
			}
		}
		// return;
	}
}

InitTreeSitter();

const RequestSections = [
	"BasicAuth",
	"QueryStringParams",
	"FormParams",
	"MultipartFormData",
	"Cookies",
	"Options",
];

function parseRequestSection(reqChild: Parser.SyntaxNode, request: Request) {
	for (const requestSection of reqChild.children) {
		let sectionName = "";
		const keys: Record<string, string> = {};

		for (const sectionValue of requestSection.children) {
			if (sectionValue.type === "\n") {
				continue;
			}

			if (RequestSections.includes(sectionValue.type.slice(1, -1))) {
				sectionName = sectionValue.type.slice(1, -1);
			}

			if (sectionValue.type === "key_value") {
				const key = sectionValue.children[0].text;
				const value = sectionValue.children[2].text.trim();
				keys[key] = value;
			}
		}

		if (sectionName !== "") {
			request.requestSections[sectionName] = keys;
		}
	}
}

const ResponseSections = ["Captures", "Asserts"];

function parseResponseSection(resChild: Parser.SyntaxNode, response: Response) {
	for (const requestSection of resChild.children) {
		let sectionName = "";
		const keys: Record<string, string> = {};

		for (const sectionValue of requestSection.children) {
			if (sectionValue.type === "\n") {
				continue;
			}

			if (ResponseSections.includes(sectionValue.type.slice(1, -1))) {
				sectionName = sectionValue.type.slice(1, -1);
			}

			if (sectionValue.type === "key_value") {
				const key = sectionValue.children[0].text;
				const value = sectionValue.children[2].text.trim();
				keys[key] = value;
			}
		}

		if (sectionName !== "") {
			response.responseSections[sectionName] = keys;
		}
	}
}

function logTypes(node: Parser.SyntaxNode) {
	console.log(node.children.map((n) => n.type));
}
