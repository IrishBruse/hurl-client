import type { Token } from "moo";
import * as fs from "node:fs";
import { Tokenizer } from "./hurl/tokenizer";

console.clear();

let lexer: Tokenizer;

main("./test/grammer.hurl");

// * = 0 or more
// + = 1 or more
// ? = Optional
// ~ = Not

function main(file: string) {
	console.log("\nLexer:");
	const text = fs.readFileSync(file).toString();
	lexer = new Tokenizer(text, true);
	lexer.dump();

	console.log("\nParser:");

	hurlFile();

	console.log("\nParse Finished");
}

// hurl-file:
//   lt*
//   entry*
//   lt*
function hurlFile() {
	//   lt*
	parseLTStar();

	//   entry*
	parseEntry();

	//   lt*
	parseLTStar();
}

// entry:
//   request
//   lt*
//   response?
function parseEntry() {
	//   request
	const request: Request = parseRequest();

	//   lt*
	parseLTStar();

	//   response?
	const response = parseResponse();

	console.log("Result", request, response);
}

// request:
//   method sp value-string lt
//   header*
//   request-section*
//   body?
function parseRequest(): Request {
	console.log("Parse Request");

	// method sp value-string lt
	const method = lexer.eat("method");
	lexer.eatSP();
	const url = lexer.eat("value-string-text");
	lexer.eatLT();

	parseHeaders();

	return {
		method,
		url,
		headers: [],
		requestSection: [],
	};
}

// response:
//   version sp status lt
//   header*
//   response-section*
//   body?
function parseResponse(): Response | undefined {
	console.log("Parse Response");

	const peekToken = lexer.peek();

	if (peekToken === undefined) {
		return undefined;
	}

	if (peekToken?.type !== "version") {
		throw new Error(
			`Expected token of type version but got ${peekToken?.type} - "${peekToken.text}"`,
		);
	}

	//   version sp status lt
	const version = lexer.eat("version");
	lexer.eatSP();
	const status = lexer.eat("status");
	lexer.eatLT();

	return {
		version,
		status,
		headers: [],
		responseSection: [],
	};
}

function parseHeaders() {
	parseLTStar();

	const text = lexer.eat("key-string-text");
	console.log(text);
}

function parseLTStar() {
	while (lexer.tryEat("sp")) {}

	lexer.tryEat("comment");

	lexer.tryEat("sp");
}

type Request = {
	method: string;
	url: string;
	headers: Token[];
	requestSection: Token[];
	body?: Token;
};

type Response = {
	version: string;
	status: string;
	headers: Token[];
	responseSection: Token[];
	body?: Token;
};
