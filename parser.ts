import { Token } from "./token.ts";
import type { TokenPair } from "./reader.ts";

export enum NodeType {
  LIST = "nt-list",
  SYMBOL = "nt-symbol",
  KEYWORD = "nt-keyword",
  STRING = "nt-literal-string",
  NUMBER = "nt-literal-number",
}

export interface AbedASTNode {
  nodeType: NodeType;
}
export class ListNode implements AbedASTNode {
  nodeType: NodeType = NodeType.LIST;
  contents: AbedASTNode[];
  constructor(contents: AbedASTNode[]) {
    this.contents = contents;
  }

  toJSON() {
    return this.contents;
  }
}
export class StringNode implements AbedASTNode {
  nodeType: NodeType = NodeType.STRING;
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  toJSON() {
    return this.value;
  }
}
export class SymbolNode implements AbedASTNode {
  nodeType: NodeType = NodeType.SYMBOL;
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  toJSON() {
    return "symbol:" + this.value;
  }
}
export class KeywordNode implements AbedASTNode {
  nodeType: NodeType = NodeType.KEYWORD;
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  toJSON() {
    return "keyword:" + this.value;
  }
}
export class NumberNode implements AbedASTNode {
  nodeType: NodeType = NodeType.NUMBER;
  value: number;
  constructor(value: number) {
    this.value = value;
  }
  toJSON() {
    return this.value;
  }
}

export function parse(tokens: TokenPair[]): AbedASTNode {
  const root = new ListNode([]);
  return parseTokens(root, tokens, 0);
}

function parseTokens(
  root: ListNode,
  tokens: TokenPair[],
  position: number,
): AbedASTNode {
  const [newPosition, node] = parseToken(tokens, position);
  root.contents.push(node);
  if (newPosition >= tokens.length) {
    return root;
  } else {
    return parseTokens(root, tokens, newPosition);
  }
}

function parseToken(
  tokens: TokenPair[],
  position: number,
): [number, AbedASTNode] {
  const [tokenType, token] = tokens[position];
  return (function (): [number, AbedASTNode] {
    switch (tokenType) {
      case Token.SYMBOL:
        return [position + 1, new SymbolNode(token)];
      case Token.KEYWORD:
        return [position + 1, new KeywordNode(token)];
      case Token.STRING:
        return [position + 1, new StringNode(token)];
      case Token.NUMBER:
        return [position + 1, new NumberNode(parseFloat(token))];
      case Token.PAREN_OPEN:
        return parseList(tokens, position + 1);
      default:
        throw new Error(`Fallthrough! ${position} ${tokenType} ${token}`);
    }
  })();
}

function parseList(
  tokens: TokenPair[],
  position: number,
): [number, AbedASTNode] {
  const listNode = new ListNode([]);
  for (;;) {
    const tok = tokens[position];
    if (
      tok == null || (tok[0] === Token.PAREN_CLOSE)
    ) {
      return [position + 1, listNode];
    }

    const [newPosition, node] = parseToken(tokens, position);
    listNode.contents.push(node);
    position = newPosition;
  }
}
