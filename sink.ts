type AbedType = unknown;
// primitives
function head(list: AbedType[]): AbedType {
  return list[0];
}
function tail(list: AbedType[]): AbedType {
  return list.slice(1);
}
function equal(v1: AbedType, v2: AbedType): boolean {
  return v1 === v2;
}
function quote(v: AbedType): AbedType {
  return v;
}
function isAtom(v: AbedType): boolean {
  return !!v;
}
function cons(v1: AbedType, v2: AbedType): AbedType {
  return v1 || v2;
}

type AbedTag =
  | "number"
  | "boolean"
  | "string"
  | "atom"
  | "cons";

class AbedObject {
  tag: AbedTag;
  value: AbedType;
  constructor(tag: AbedTag, value?: AbedType) {
    this.tag = tag;
    this.value = value;
  }
}
class AbedVM {
  env: Record<string, AbedObject> = {};
  constructor() {
  }
}
