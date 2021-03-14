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
  if (ast.nodeType === NodeType.LIST) {
    let result = "";
    for (const form of (ast as ListNode).contents) {
      result += compileNode(form, {}, true);
    }
    return function (environment) {
      return result;
    };
  } else {
    const entry = compileNode(ast, {}, true);
    return function (environment) {
      return entry;
    };
  }
}

interface CompileMode {
  quoted?: boolean;
  parameter?: boolean;
}

function compileNode(
  ast: AbedASTNode,
  mode?: CompileMode,
  topLevel?: boolean,
): Code {
  switch (ast.nodeType) {
    case NodeType.LIST: {
      const node = ast as ListNode;
      if (node.contents.length === 0) {
        return "null";
      }
      const first = node.contents[0];
      if (
        first.nodeType === NodeType.SYMBOL &&
        (first as SymbolNode).value === "quote"
      ) {
        const forms = node.contents.slice(1).map((v) =>
          compileNode(v, { quoted: true })
        );
        return `[${forms.join(", ")}]`;
      } else if (mode?.quoted) {
        const forms = node.contents.map((v) => compileNode(v, mode));
        return `[${forms.join(", ")}]`;
      } else {
        if (
          first.nodeType === NodeType.SYMBOL &&
          (first as SymbolNode).value === "fn"
        ) {
          const second = node.contents[1];
          const rest = node.contents.slice(2);
          if (second.nodeType !== NodeType.LIST) {
            throw new Error("Compilation error");
          }
          const parameters = (second as ListNode).contents.map((v) =>
            compileNode(v, { ...mode, parameter: true })
          );
          const forms = rest.map((v) => compileNode(v, mode));
          return `function (${parameters.join(", ")}) {${forms.join(";")}}`;
        } else {
          const fn = compileNode(first, mode);
          if (fn.includes("doctype")) {
            console.log("asdf", JSON.stringify(node, null, 2));
          }
          if (node.contents.length > 1) {
            const args = node.contents.slice(1).map((v) =>
              compileNode(v, mode)
            );
            return `${fn}(${args.join(", ")})${topLevel === true ? ";" : ""}`;
          } else {
            return `${fn}()${topLevel === true ? ";" : ""}`;
          }
        }
      }
    }
    case NodeType.SYMBOL:
      if (mode?.parameter) {
        return (ast as SymbolNode).value;
      }
      if (mode?.quoted) {
        return `"${(ast as SymbolNode).value}"`;
      }
      return `environment["${(ast as SymbolNode).value}"]`;
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
