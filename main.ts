// import { padLeft } from "./utilities.ts";
import { Reader } from "./reader.ts";
import { parse } from "./parser.ts";
import { compile } from "./compiler.ts";

const reader = new Reader(`(doctype :html)
(html
  (head
    (meta [:http-equiv "Content-Type" :content "text/html; charset=utf-8"])
    (title (data :title)))
  (body
    (div [:id "root"]
      (h1 (data :title))
      (when (data :subtitle)
        (h2 (data :subtitle)))
      (let [v (data:value)]
        (cond [(< v 0) "less than 0"]
              [(= v 0) "equal to 0"]
              [(> v 0) "greater than 0"]
              "default: should not happen"))
      (map
        (fn [text] (p [:class "subtle"] (string/to-upper text)))
        (data :paragraphs)))))`);

const tokens = reader.tokenize();

console.log(tokens);

{
  const tokens = new Reader(`(quote 1 2 "hello" (quote (a b c)))`).tokenize();
  const ast = parse(tokens);

  console.log(JSON.stringify(ast, null, 2));

  const program = compile(ast);
  const result = program({});
  console.log(result);
}
