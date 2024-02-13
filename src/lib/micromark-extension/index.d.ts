import { TokenTypeMap as OrgTokenTypeMap } from "micromark-util-types";

declare module "micromark-util-types" {
  interface TokenTypeMap extends OrgTokenTypeMap {
    strikethroughSequence: "strikethroughSequence";
    strikethroughSequenceTemporary: "strikethroughSequenceTemporary";
    strikethrough: "strikethrough";
    strikethroughText: "strikethroughText";
  }
}
