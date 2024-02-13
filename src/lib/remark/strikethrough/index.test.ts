import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkStrikethrough from "./index.js";

describe("remark-strikethrough", () => {
  const cases = [
    [
      "testing ~~strikethrough~~\n",
      "\n<p>testing <del>strikethrough</del></p>\n",
    ],
    [
      "testing ~strikethrough~\n",
      "\n<p>testing <del>strikethrough</del></p>\n",
    ],
    ["testing ~~strikethrough~\n", "\n<p>testing ~~strikethrough~</p>\n"],
    ["testing ~strikethrough~~\n", "\n<p>testing ~strikethrough~~</p>\n"],
  ];

  const parser = unified()
    .use(remarkParse)
    .use(remarkStrikethrough)
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify);

  test("fromMarkdown", async () => {
    for (const [input, output] of cases) {
      const file = await parser.process(input);
      expect(String(file)).toEqual(output);
    }
  });
});
