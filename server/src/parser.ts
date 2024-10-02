import { compile, error, type Token } from "moo";
import * as fs from "node:fs";

console.clear();

const lexer = compile({
	sp: /[ \t]/,
	newline: { match: /\n/, lineBreaks: true },
	method: /GET/,
	"value-string-text": { match: /(?!#\n\\).+/, lineBreaks: true },
	// valie: /\ [#|\|\b|\f|\n|\r|\t]/,
	hexdigit: /[0-9A-Fa-f]/,
	version: /(?:HTTP\/1\.0)/,
	LexerError: error,
	openTemplate: { match: /\{\{/ },
});

const text = fs
	.readFileSync("/home/econn/git/hurl-client/test/minimal.hurl")
	.toString();

lexer.reset(text);

let token: Token | undefined = undefined;
do {
	token = lexer.next();
	if (token && token?.type !== "LexerError") {
		console.log(token);
	}
} while (token !== undefined);
