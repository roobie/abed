import { NodeType } from "./parser.ts";
import type {
  AbedASTNode,
  KeywordNode,
  ListNode,
  NumberNode,
  StringNode,
  SymbolNode,
} from "./parser.ts";

type AbedType = unknown;
type AbedEnvironment = Record<string, AbedType>;
type AbedProgram = (environment: AbedEnvironment) => string;

type Code = string;

export function compile(ast: AbedASTNode): AbedProgram {
  const entry = compileNode(ast);
  return function (environment) {
    return entry;
  };
}

function compileNode(ast: AbedASTNode): Code {
  switch (ast.nodeType) {
    case NodeType.LIST: {
      const node = ast as ListNode;
      const fn = compileNode(node.contents[0]);
      const args = node.contents.slice(1).map(compileNode);
      if (args.length > 0) {
        return `${fn}.call(null, ${args.join(", ")})`;
      } else {
        return `${fn}.call(null)`;
      }
    }
    case NodeType.SYMBOL:
      return `environment["${(ast as KeywordNode).value}"]`;
    case NodeType.KEYWORD:
      return `"${(ast as KeywordNode).value}"`;
    case NodeType.STRING:
      return `"${(ast as StringNode).value}"`;
    case NodeType.NUMBER:
      return String((ast as NumberNode).value);
    default:
      throw new Error("invalid AST node");
  }
}
