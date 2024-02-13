import { Delete, Parents } from 'mdast';
import {
  CompileContext,
  Extension as FromMarkdownExtension,
  Handle as FromMarkdownHandle,
} from 'mdast-util-from-markdown';
import {
  ConstructName,
  Info,
  State,
  Options as ToMarkdownExtension,
  Handle as ToMarkdownHandle,
} from 'mdast-util-to-markdown';
import { Token } from 'micromark-util-types';

const enterStrikethrough: FromMarkdownHandle = function (this: CompileContext, token: Token) {
  this.enter({ type: 'delete', children: [] }, token);
};

const exitStrikethrough: FromMarkdownHandle = function (this: CompileContext, token: Token) {
  this.exit(token);
};

/**
 * Create an extension for `mdast-util-from-markdown` to enable GFM
 * strikethrough in markdown.
 *
 * @returns {FromMarkdownExtension}
 *   Extension for `mdast-util-from-markdown` to enable GFM strikethrough.
 */
export const strikethroughFromMarkdown = function (): FromMarkdownExtension {
  return {
    canContainEols: ['delete'],
    enter: {
      strikethrough: enterStrikethrough,
    },
    exit: {
      strikethrough: exitStrikethrough,
    },
  };
};

const peekDelete: ToMarkdownHandle = function () {
  return '~';
};

const handleDelete: ToMarkdownHandle & { peek: ToMarkdownHandle } = function (
  node: Delete,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const tracker = state.createTracker(info);
  const exit = state.enter('strikethrough');
  let value = tracker.move('~~');
  value += state.containerPhrasing(node, {
    ...tracker.current(),
    before: value,
    after: '~',
  });
  value += tracker.move('~~');
  exit();
  return value;
};
handleDelete.peek = peekDelete;

/**
 * List of constructs that occur in phrasing (paragraphs, headings), but cannot
 * contain strikethrough.
 * So they sort of cancel each other out.
 * Note: could use a better name.
 *
 * Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
 */
const constructsWithoutStrikethrough: ConstructName[] = [
  'autolink',
  'destinationLiteral',
  'destinationRaw',
  'reference',
  'titleQuote',
  'titleApostrophe',
];

/**
 * Create an extension for `mdast-util-to-markdown` to enable GFM
 * strikethrough in markdown.
 */
export const strikethroughToMarkdown = function (): ToMarkdownExtension {
  return {
    unsafe: [
      {
        character: '~',
        inConstruct: 'phrasing',
        notInConstruct: constructsWithoutStrikethrough,
      },
    ],
    handlers: { delete: handleDelete },
  };
};
