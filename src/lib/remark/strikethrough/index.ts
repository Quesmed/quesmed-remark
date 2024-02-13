import { Options } from "micromark-util-types";
import { Processor } from "unified";

import {
  strikethroughFromMarkdown,
  strikethroughToMarkdown,
} from "../../mdast-util/strikethrough/index.js";
import { strikethrough } from "../../micromark-extension/strikethrough/index.js";

function remarkStrikethrough(
  this: Processor,
  options: Options & { singleTilde?: boolean } = {}
) {
  const data = this.data();

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = []);
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
  const toMarkdownExtensions =
    data.toMarkdownExtensions || (data.toMarkdownExtensions = []);

  micromarkExtensions.push(strikethrough(options));
  fromMarkdownExtensions.push(strikethroughFromMarkdown());
  toMarkdownExtensions.push(strikethroughToMarkdown());
}

export default remarkStrikethrough;
