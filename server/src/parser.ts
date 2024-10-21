import type { Token } from "moo";
import * as fs from "node:fs";
import { type TokenType, Tokenizer } from "./hurl/tokenizer";

console.clear();

let token: Token | undefined = undefined;
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
	lexer.next();

	//   lt*
	parseLT();

	//   entry*
	parseEntry();

	//   lt*
	parseLT();
}

// entry:
//   request
//   lt*
//   response?
function parseEntry() {
	token = lexer.peek();
	console.log(token);

	if (token === undefined) {
		return;
	}

	const type = token.type as TokenType;

	//   request
	let request: Request;
	if (type === "method") {
		request = parseRequest();
	}

	//   lt*
	parseLT();

	//   response?
	const peekToken = lexer.peek();
	let response: Response | undefined = undefined;
	if (peekToken?.type === "version") {
		response = parseResponse();
	}

	console.log("Result", request, reponse);
}

// request:
//   method sp value-string lt
//   header*
//   request-section*
//   body?
function parseRequest(): Request {
	// method sp value-string lt
	const method = lexer.eat("method");
	lexer.eatSP();
	const url = lexer.eat("value-string-text");

	parseLT();

	lexer.tryEat("sp");

	return {
		method,
		url,
		headers: [],
		requestSection: [],
	};
}

function parseResponse(): Response {
	const version = lexer.eat("version");
	lexer.eatSP();
	const status = lexer.eat("status");
	lexer.eatSP();

	console.log(version, status);

	return {
		version,
		status,
		headers: [],
		responseSection: [],
	};
}

function parseLT() {
	// TODO: parse whitespace and comments
	while (lexer.tryEat("sp")) {}

	lexer.tryEat("comment");

	// Eat comments
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
