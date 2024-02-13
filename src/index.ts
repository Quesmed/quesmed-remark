import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkStrikethrough from "./lib/remark/strikethrough/index.js";

const file = await unified()
  .use(remarkParse)
  .use(remarkStrikethrough)
  .use(remarkRehype)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process("# Hello world!\nTesting the ~strikethrough~");

console.log(String(file));
