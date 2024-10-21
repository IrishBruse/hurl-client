import {
	type Lexer,
	type Token as MooToken,
	type Rules,
	compile,
	error,
} from "moo";

const methods = [
	"GET",
	"POST",
	"PUT",
	"HEAD",
	"DELETE",
	"PATCH",
	"OPTIONS",
	"CONNECT",
	"TRACE",
];

const rules = {
	sp: { match: /[ \t\n]+/, lineBreaks: true },
	comment: { match: /# .*/ },
	version: { match: /(?:HTTP(?:\/1\.0|\/1\.1|\/2|\/3)?)/ },
	number: /[0-9\.]+/,
	method: methods,
	"key-string-text": {
		match: /(?:[A-Za-z0-9]|"_"|"-"|"."|"[" | "]"|"@"|"$")+/,
	},
	status: { match: /[1-5][0-9][0-9]/ },
	"value-string-text": { match: /(?!#\n\\).+/, lineBreaks: true },
	hexdigit: { match: /[0-9A-Fa-f]/ },
	LexerError: error,
} as const satisfies Rules;

export type TokenType = keyof typeof rules;
export type Token = (MooToken & { type?: TokenType }) | undefined;

export class Tokenizer {
	token?: Token;
	lexer: Lexer;
	debug: boolean;
	text: string;

	constructor(text: string, debug = false) {
		this.debug = debug;
		this.text = text;

		this.lexer = compile(rules);
		this.reset();
	}

	peek(): Token | undefined {
		return this.token;
	}

	reset() {
		this.lexer.reset(this.text);
	}

	eat(expected: TokenType): string {
		if (this.token?.type !== expected) {
			throw new Error(
				`Unexpected token of type "${this.token?.type}" expected "${expected}"`,
			);
		}
		const tok = this.next();

		if (tok === undefined) {
			throw new Error("Unexpected end of file");
		}

		return tok.value;
	}

	tryEat(expected: TokenType): boolean {
		if (this.token?.type !== expected) {
			return false;
		}
		const tok = this.next();

		if (tok === undefined) {
			return false;
		}

		return true;
	}

	dump(ignoreSP = true) {
		let token: Token = this.token;
		do {
			if (token && !(ignoreSP && token.type === "sp")) {
				console.log(token.type, JSON.stringify(token.value), token.offset);
			}
			token = this.lexer.next() as Token;
		} while (token !== undefined);

		this.reset();
	}

	next(): Token | undefined {
		const token = this.token;
		this.token = this.lexer.next() as Token;

		if (this.debug && this.token) {
			console.log(
				this.token.type,
				JSON.stringify(this.token.value),
				this.token.offset,
			);
		}

		return token as Token;
	}

	eatSP() {
		this.eat("sp");
	}

	eatLT() {
		while (this.token?.type === "comment") {
			this.eat("comment");
		}
		this.eat("sp");
	}
}
