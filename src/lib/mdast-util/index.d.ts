import { ConstructNameMap, ConstructNameMap as OrgConstructNameMap } from 'mdast-util-to-markdown';

declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap extends OrgConstructNameMap {
    /**
     * Whole strikethrough.
     *
     * ```markdown
     * > | ~~a~~
     *     ^^^^^
     * ```
     */
    strikethrough: 'strikethrough';
  }
  export type ConstructName = ConstructNameMap[keyof ConstructNameMap];
}

const test: ConstructNameMap = {};
test.strikethrough;
