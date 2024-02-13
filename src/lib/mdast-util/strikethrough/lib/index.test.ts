import { strikethrough } from "../../../micromark-extension/strikethrough/index.js";
import { fromMarkdown } from "mdast-util-from-markdown";
import { strikethroughFromMarkdown, strikethroughToMarkdown } from "./index.js";
import { toMarkdown } from "mdast-util-to-markdown";
import { find } from "unist-util-find";
import { Root } from "mdast";

describe("mdast-util-strikethrough", () => {
  const cases = [
    ["testing ~~strikethrough~~\n", "<p>testing <del>strikethrough</del></p>"],
    ["testing ~strikethrough~\n", "<p>testing <del>strikethrough</del></p>"],
  ];
  const failCases = [
    ["testing ~~strikethrough~\n", "<p>testing ~~strikethrough~</p>"],
    ["testing ~strikethrough~~\n", "<p>testing ~strikethrough~~</p>"],
  ];
  const trees: Root[] = [];

  test("fromMarkdown", () => {
    for (const [input] of cases) {
      const tree = fromMarkdown(input, {
        extensions: [strikethrough()],
        mdastExtensions: [strikethroughFromMarkdown()],
      });
      trees.push(tree);
      const delNode = find(tree, { type: "delete" });
      expect(delNode).toBeTruthy();
    }
    for (const [input] of failCases) {
      const tree = fromMarkdown(input, {
        extensions: [strikethrough()],
        mdastExtensions: [strikethroughFromMarkdown()],
      });
      const delNode = find(tree, { type: "delete" });
      expect(delNode).toBeUndefined();
    }
  });
  test("toMarkdown", () => {
    const input = cases[0][0];
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i];
      const md = toMarkdown(tree, {
        extensions: [strikethroughToMarkdown()],
      });
      expect(md).toEqual(input);
    }
  });
});
