import { Token } from "./token.ts";

function isSpace(v: string): boolean {
  return v === " " ||
    v === "\n" ||
    v === "\r" ||
    v === "\t";
}

function isParenOpen(v: string): boolean {
  return v === "(";
}

function isParenClose(v: string): boolean {
  return v === ")";
}

function isParenOpenData(v: string): boolean {
  return v === "[";
}

function isParenCloseData(v: string): boolean {
  return v === "]";
}

function isStringDelimiter(v: string): boolean {
  return v === '"';
}

function isNumberFirstChar(v: string): boolean {
  return /[0-9]/.test(v);
}

function isNumberRestChar(v: string): boolean {
  return /[0-9\.]/.test(v);
}

function isKeywordFirstChar(v: string): boolean {
  return v === ":";
}

function isSymbolFirstChar(v: string): boolean {
  return /[A-z\/\.\?\+\=\-\_\*\&\^<>]/.test(v);
}

function isSymbolRestChar(v: string): boolean {
  return v !== "]" && /[A-z0-9\/\.\?\+\=\-\_\*\&\^<>]/.test(v);
}

export type TokenPair = [Token, string];

export class Reader {
  input: string;
  current: string | null = "";
  position = 0;
  line = 1;
  column = 0;
  context?: string;
  balance = 0;
  constructor(input: string) {
    this.input = input;
    this.current = this.getChar();
  }

  public tokenize(): TokenPair[] {
    const accumulator: TokenPair[] = [];
    for (;;) {
      const tokPair = this.getToken();
      if (tokPair == null) {
        break;
      }
      accumulator.push(tokPair);
    }
    return accumulator;
  }

  getChar() {
    const result = this.input.charAt(this.position);
    this.position += 1;
    return result || null;
  }

  advance() {
    this.current = this.getChar();
    this.column += 1;
  }

  lookAhead(offset = 1): string | null {
    var result = this.input.charAt(this.position + offset);
    if (result === "") {
      return null;
    }
    return result;
  }

  getErrorMessage(message?: string): string {
    return `${message || "Invalid syntax."} ${this.context ||
      "?"} - balance ${this.balance}, line ${this.line}, column ${this.column}: '${this.current}'`;
  }

  last(): string {
    return this.input.charAt(this.position - 1);
  }

  getToken(): TokenPair | null {
    let token = "";
    if (this.current === null) {
      return null;
    }

    while (isSpace(this.current)) {
      if (this.current === "\n") {
        this.line += 1;
        this.column = 0;
      }
      this.advance();
    }

    if (isParenOpen(this.current)) {
      this.advance();
      this.balance += 1;
      return [Token.PAREN_OPEN, "("];
      // --
    } else if (isParenClose(this.current)) {
      this.advance();
      this.balance -= 1;
      if (this.balance < 0) {
        throw new Error(this.getErrorMessage("Unbalanced form."));
      }
      return [Token.PAREN_CLOSE, ")"];
      // --
    } else if (isParenOpenData(this.current)) {
      this.advance();
      return [Token.PAREN_OPEN_DATA, "["];
      // --
    } else if (isParenCloseData(this.current)) {
      this.advance();
      return [Token.PAREN_CLOSE_DATA, "]"];
      // --
    } else if (isStringDelimiter(this.current)) {
      this.advance();
      while (
        this.position < this.input.length &&
        !isStringDelimiter(this.current)
      ) {
        token += this.current;
        this.advance();
      }
      this.advance();
      return [Token.STRING, token];
      // --
    } else if (isNumberFirstChar(this.current)) {
      while (
        this.position < this.input.length &&
        isNumberRestChar(this.current)
      ) {
        token += this.current;
        this.advance();
      }
      return [Token.NUMBER, token];
      // --
    } else if (isKeywordFirstChar(this.current)) {
      this.advance();
      while (
        this.position < this.input.length &&
        isSymbolRestChar(this.current)
      ) {
        token += this.current;
        this.advance();
      }
      return [Token.KEYWORD, token];
      // --
    } else if (isSymbolFirstChar(this.current)) {
      while (
        this.position < this.input.length &&
        isSymbolRestChar(this.current)
      ) {
        if (this.current === "]") {
          throw new Error("asd" + String(isSymbolRestChar(this.current)));
        }
        token += this.current;
        this.advance();
      }
      return [Token.SYMBOL, token];
      // --
    } else {
      throw new Error(this.getErrorMessage());
    }
  }
}
