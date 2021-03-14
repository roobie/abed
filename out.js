environment["doctype"]("html");
environment["html"](
  environment["head"](
    environment["meta"]([
      "http-equiv",
      "Content-Type",
      "content",
      "text/html; charset=utf-8",
    ]),
    environment["title"](environment["data"]("title")),
  ),
  environment["body"](
    environment["div"](
      ["id", "root"],
      environment["h1"](environment["data"]("title")),
      environment["when"](
        environment["data"]("subtitle"),
        environment["h2"](environment["data"]("subtitle")),
      ),
      environment["let"](
        environment["v"](environment["data"]("value")),
        environment["cond"](
          [["<", "v", 0], "less than 0"],
          [["=", "v", 0], "equal to 0"],
          [[">", "v", 0], "greater than 0"],
          "default: should not happen",
        ),
      ),
      environment["map"](function (text) {
        environment["p"](
          ["class", "subtle"],
          environment["string/to-upper"](environment["text"]),
        );
      }, environment["data"]("paragraphs")),
    ),
  ),
);
