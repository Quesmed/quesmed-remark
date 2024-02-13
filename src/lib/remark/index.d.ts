import { Data as OrgData } from "unified";
import { Options as ToMarkdownExtension } from "mdast-util-to-markdown";

declare module "unified" {
  interface Data extends OrgData {
    toMarkdownExtensions?: Array<ToMarkdownExtension[] | ToMarkdownExtension>;
  }
}
