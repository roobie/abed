import { Token } from "./token.ts";

export interface TokenData {
  token: Token;
  value: string;
}

type TokenizeResult = [newOffset: number, tokenData: TokenData];

export function tokenize(sourceCode: string): TokenData[] {
  const length = sourceCode.length;
  let offset = 0;
  const result = [];

  while (offset < length) {
    let token: TokenData;
    [offset, token] = applyCorrectTokenizer(sourceCode, offset);
    result.push(token);
  }
  return result;
}

interface Tokenizer {
  isApplicable: (sourceCode: string, offset: number) => boolean;
  apply: (sourceCode: string, offset: number) => TokenizeResult;
}

const tokenizers: Tokenizer[] = [
  {
    isApplicable(sourceCode, offset) {
      return sourceCode.charAt(offset) === "(";
    },
    apply(_sourceCode, offset) {
      return [offset + 1, {
        token: Token.PAREN_OPEN,
        value: "(",
      }];
    },
  },
];
function applyCorrectTokenizer(
  sourceCode: string,
  offset: number,
): TokenizeResult {
  for (const tokenizer of tokenizers) {
    if (tokenizer.isApplicable(sourceCode, offset)) {
      return tokenizer.apply(sourceCode, offset);
    }
  }
}
