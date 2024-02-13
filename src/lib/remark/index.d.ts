import { Options as ToMarkdownExtension } from 'mdast-util-to-markdown';
import { Data as OrgData } from 'unified';

declare module 'unified' {
  interface Data extends OrgData {
    toMarkdownExtensions?: Array<ToMarkdownExtension[] | ToMarkdownExtension>;
  }
}
