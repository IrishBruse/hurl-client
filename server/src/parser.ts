import path = require("node:path");
import Parser = require("web-tree-sitter");
import * as fs from "fs";

export const highlights = `
; highlights.scm

"[QueryStringParams]" @property
"[FormParams]" @property
"[MultipartFormData]" @property
"[Cookies]" @property
"[Captures]" @property
"[Asserts]" @property
"[Options]" @property
"[BasicAuth]" @property

(comment) @comment

(key_string) @property
(json_key_string) @property

(value_string) @string
(quoted_string) @string
(json_string) @string
(file_value) @string.special
(regex) @string.regex

"\\\\" @string.escape
(regex_escaped_char) @string.escape
(quoted_string_escaped_char) @string.escape
(key_string_escaped_char) @string.escape
(value_string_escaped_char) @string.escape
(oneline_string_escaped_char) @string.escape
(multiline_string_escaped_char) @string.escape
(filename_escaped_char) @string.escape
(json_string_escaped_char) @string.escape

(method) @type.builtin
(multiline_string_type) @type

"status" @function.builtin
"url" @function.builtin
"header" @function.builtin
"cookie" @function.builtin
"body" @function.builtin
"xpath" @function.builtin
"jsonpath" @function.builtin
"regex" @function.builtin
"variable" @function.builtin
"duration" @function.builtin
"sha256" @function.builtin
"md5" @function.builtin
"bytes" @function.builtin

(filter) @attribute

(version) @string.special

"null" @constant.builtin
"cacert" @constant.builtin
"compressed" @constant.builtin
"location" @constant.builtin
"insecure" @constant.builtin
"max-redirs" @constant.builtin
"path-as-is" @constant.builtin
"proxy" @constant.builtin
"retry" @constant.builtin
"retry-interval" @constant.builtin
"retry-max-count" @constant.builtin
(variable_option "variable") @constant.builtin
"verbose" @constant.builtin
"very-verbose" @constant.builtin

(boolean) @boolean

(variable_name) @variable

"not" @keyword.operator
"equals" @keyword.operator
"==" @operator
"notEquals" @keyword.operator
"!=" @operator
"greaterThan" @keyword.operator
">" @operator
"greaterThanOrEquals" @keyword.operator
">=" @operator
"lessThan" @keyword.operator
"<" @operator
"lessThanOrEquals" @keyword.operator
"<=" @operator
"startsWith" @keyword.operator
"endsWith" @keyword.operator
"contains" @keyword.operator
"matches" @keyword.operator
"exists" @keyword.operator
"includes" @keyword.operator
"isInteger" @keyword.operator
"isFloat" @keyword.operator
"isBoolean" @keyword.operator
"isString" @keyword.operator
"isCollection" @keyword.operator

(integer) @number
(float) @float
(status) @number
(json_number) @float

":" @punctuation.delimiter
"," @punctuation.delimiter

"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"{{" @punctuation.special
"}}" @punctuation.special

"base64," @string.special
"file," @string.special
"hex," @string.special
`;

const symbolTypeMap: Record<string, string> = {
	property: "property",
	comment: "comment",
	string: "string",
	"string.special": "string",
	"string.regex": "regexp",
	"string.escape": "operator",
	type: "type",
	"type.builtin": "type",
	"function.builtin": "function",
	attribute: "decorator",
	"constant.builtin": "enumMember",
	boolean: "boolean",
	"keyword.operator": "operator",
	operator: "operator",
	number: "number",
	float: "number",
};

async function parserInit() {
	await Parser.init();
	const parser = new Parser();
	const langFile = path.join(__dirname, "../", "tree-sitter-hurl.wasm");
	const Hurl = await Parser.Language.load(langFile);
	parser.setLanguage(Hurl);
	const query = Hurl.query(highlights);
	return { parser: parser, query: query };
}

async function main() {
	const { parser, query } = await parserInit();

	const text = fs
		.readFileSync(path.join(__dirname, "../../test/GET200.hurl"))
		.toString();

	const tree = parser.parse(text);
	const captures = query.captures(tree.rootNode);

	for (const capture of captures) {
		if (!symbolTypeMap[capture.name]) return;

		for (
			let i = capture.node.startPosition.row;
			i <= capture.node.endPosition.row;
			i++
		) {
			let startColumn = capture.node.startPosition.column;
			if (i !== capture.node.startPosition.row) {
				startColumn = 0;
			}
			let endColumn =
				capture.node.endIndex -
				capture.node.startIndex +
				capture.node.startPosition.column;
			if (i === capture.node.endPosition.row) {
				endColumn = capture.node.endPosition.column;
			}

			console.log(symbolTypeMap[capture.name] || capture.name);

			// tokensBuilder.push(
			// 	new vscode.Range(
			// 		new vscode.Position(i, startColumn),
			// 		new vscode.Position(i, endColumn),
			// 	),
			// 	symbolTypeMap[capture.name] || capture.name,
			// );
		}
	}
}
main();
