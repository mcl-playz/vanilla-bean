const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const escText = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s: string): string => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const kebab = (k: string): string => (k.startsWith("--") ? k : k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()));

export class SNode {
  nodeType = 0;
  parentNode: SNode | null = null;
  childNodes: SNode[] = [];

  addEventListener(): void {}
  removeEventListener(): void {}

  get firstChild(): SNode | null {
    return this.childNodes[0] ?? null;
  }
  get nextSibling(): SNode | null {
    const p = this.parentNode;
    if (!p) return null;
    const i = p.childNodes.indexOf(this);
    return i < 0 ? null : (p.childNodes[i + 1] ?? null);
  }
  appendChild(child: SNode): SNode {
    if (child instanceof SFragment) {
      for (const c of child.childNodes.slice()) this.appendChild(c);
      child.childNodes = [];
      return child;
    }
    if (child.parentNode) child.remove();
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }
  insertBefore(node: SNode, ref: SNode | null): SNode {
    if (ref == null) return this.appendChild(node);
    if (node instanceof SFragment) {
      for (const c of node.childNodes.slice()) this.insertBefore(c, ref);
      node.childNodes = [];
      return node;
    }
    if (node.parentNode) node.remove();
    const i = this.childNodes.indexOf(ref);
    node.parentNode = this;
    if (i < 0) this.childNodes.push(node);
    else this.childNodes.splice(i, 0, node);
    return node;
  }
  removeChild(child: SNode): SNode {
    const i = this.childNodes.indexOf(child);
    if (i >= 0) this.childNodes.splice(i, 1);
    child.parentNode = null;
    return child;
  }
  remove(): void {
    this.parentNode?.removeChild(this);
  }
  replaceWith(node: SNode): void {
    this.parentNode?.insertBefore(node, this);
    this.remove();
  }
  replaceChildren(...nodes: SNode[]): void {
    for (const c of this.childNodes) c.parentNode = null;
    this.childNodes = [];
    for (const n of nodes) this.appendChild(n);
  }
  toHTML(): string {
    let s = "";
    for (const c of this.childNodes) s += c.toHTML();
    return s;
  }
  cloneNode(_deep?: boolean): SNode {
    return new SNode();
  }
}

export class SText extends SNode {
  constructor(public data: string) {
    super();
    this.nodeType = 3;
  }
  get textContent(): string {
    return this.data;
  }
  set textContent(v: string) {
    this.data = v;
  }
  toHTML(): string {
    return escText(this.data);
  }
  cloneNode(): SNode {
    return new SText(this.data);
  }
}

export class SComment extends SNode {
  constructor(public data: string) {
    super();
    this.nodeType = 8;
  }
  toHTML(): string {
    return "<!--" + this.data + "-->";
  }
  cloneNode(): SNode {
    return new SComment(this.data);
  }
}

class SRaw extends SNode {
  constructor(public html: string) {
    super();
    this.nodeType = 3;
  }
  toHTML(): string {
    return this.html;
  }
  cloneNode(): SNode {
    return new SRaw(this.html);
  }
}

export class SElement extends SNode {
  localName: string;
  attrs = new Map<string, string>();
  styleObj: Record<string, string> = {};
  styleStr = "";
  constructor(tag: string) {
    super();
    this.nodeType = 1;
    this.localName = tag.toLowerCase();
  }
  get tagName(): string {
    return this.localName.toUpperCase();
  }

  setAttribute(name: string, value: unknown): void {
    this.attrs.set(name, value == null ? "" : String(value));
  }
  getAttribute(name: string): string | null {
    return this.attrs.has(name) ? this.attrs.get(name)! : null;
  }
  removeAttribute(name: string): void {
    this.attrs.delete(name);
  }
  hasAttribute(name: string): boolean {
    return this.attrs.has(name);
  }

  get className(): string {
    return this.attrs.get("class") ?? "";
  }
  set className(v: string) {
    this.attrs.set("class", v == null ? "" : String(v));
  }
  get id(): string {
    return this.attrs.get("id") ?? "";
  }
  set id(v: string) {
    this.attrs.set("id", String(v));
  }

  get style(): Record<string, string> {
    return this.styleObj;
  }
  set style(v: unknown) {
    if (typeof v === "string") this.styleStr = v;
    else if (v && typeof v === "object") Object.assign(this.styleObj, v);
  }

  get textContent(): string {
    let s = "";
    for (const c of this.childNodes) s += c.nodeType === 3 ? (c as SText).data : ((c as SElement).textContent ?? "");
    return s;
  }
  set textContent(v: string) {
    this.replaceChildren(new SText(v));
  }

  get innerHTML(): string {
    let s = "";
    for (const c of this.childNodes) s += c.toHTML();
    return s;
  }
  set innerHTML(html: string) {
    for (const c of this.childNodes) c.parentNode = null;
    this.childNodes = [];
    this.appendChild(new SRaw(html));
  }
  get outerHTML(): string {
    return this.toHTML();
  }

  private serializeStyle(): string {
    let s = this.styleStr;
    for (const k in this.styleObj) {
      const v = this.styleObj[k];
      if (v == null || v === "") continue;
      if (s && !s.endsWith(";")) s += ";";
      s += kebab(k) + ":" + v;
    }
    return s;
  }

  toHTML(): string {
    const tag = this.localName;
    let s = "<" + tag;
    for (const [k, v] of this.attrs) s += v === "" ? " " + k : " " + k + '="' + escAttr(v) + '"';
    const style = this.serializeStyle();
    if (style) s += ' style="' + escAttr(style) + '"';
    s += ">";
    if (VOID.has(tag)) return s;
    for (const c of this.childNodes) s += c.toHTML();
    return s + "</" + tag + ">";
  }

  querySelectorAll(sel: string): SElement[] {
    const q = parseSelector(sel);
    const out: SElement[] = [];
    walk(this, (el) => {
      if (selMatch(el, q)) out.push(el);
    });
    return out;
  }
  querySelector(sel: string): SElement | null {
    const q = parseSelector(sel);
    let found: SElement | null = null;
    walk(this, (el) => {
      if (!found && selMatch(el, q)) found = el;
    });
    return found;
  }

  cloneNode(deep?: boolean): SNode {
    const el = new SElement(this.localName);
    el.attrs = new Map(this.attrs);
    el.styleObj = { ...this.styleObj };
    el.styleStr = this.styleStr;
    if (deep) for (const c of this.childNodes) el.appendChild(c.cloneNode(true));
    return el;
  }
}

const REFLECTED: [string, string][] = [
  ["content", "content"],
  ["href", "href"],
  ["src", "src"],
  ["value", "value"],
  ["type", "type"],
  ["rel", "rel"],
  ["name", "name"],
  ["alt", "alt"],
  ["title", "title"],
  ["placeholder", "placeholder"],
  ["action", "action"],
  ["method", "method"],
  ["target", "target"],
  ["htmlFor", "for"],
];
for (const [prop, attr] of REFLECTED) {
  Object.defineProperty(SElement.prototype, prop, {
    get(this: SElement) {
      return this.attrs.get(attr) ?? "";
    },
    set(this: SElement, v: unknown) {
      this.attrs.set(attr, v == null ? "" : String(v));
    },
    configurable: true,
  });
}

export class SFragment extends SNode {
  constructor() {
    super();
    this.nodeType = 11;
  }
  cloneNode(deep?: boolean): SNode {
    const f = new SFragment();
    if (deep) for (const c of this.childNodes) f.appendChild(c.cloneNode(true));
    return f;
  }
}

export class SDocument extends SNode {
  constructor() {
    super();
    this.nodeType = 9;
  }
  createElement(tag: string): SElement {
    return new SElement(tag);
  }
  createTextNode(data: string): SText {
    return new SText(String(data));
  }
  createComment(data: string): SComment {
    return new SComment(String(data));
  }
  createDocumentFragment(): SFragment {
    return new SFragment();
  }
  get documentElement(): SElement | null {
    return (this.childNodes.find((n) => n.nodeType === 1) as SElement) ?? null;
  }
  get head(): SElement | null {
    return childByTag(this.documentElement, "head");
  }
  get body(): SElement | null {
    return childByTag(this.documentElement, "body");
  }
  get title(): string {
    return this.querySelector("title")?.textContent ?? "";
  }
  set title(v: string) {
    let t = this.querySelector("title");
    if (!t) {
      t = this.createElement("title");
      this.head?.appendChild(t);
    }
    t.textContent = v;
  }
  getElementById(id: string): SElement | null {
    let found: SElement | null = null;
    if (this.documentElement)
      walk(this.documentElement, (el) => {
        if (!found && el.attrs.get("id") === id) found = el;
      });
    return found;
  }
  querySelectorAll(sel: string): SElement[] {
    return this.documentElement ? this.documentElement.querySelectorAll(sel) : [];
  }
  querySelector(sel: string): SElement | null {
    return this.documentElement ? this.documentElement.querySelector(sel) : null;
  }
  cloneNode(deep?: boolean): SDocument {
    const d = new SDocument();
    if (deep) for (const c of this.childNodes) d.appendChild(c.cloneNode(true));
    return d;
  }
}

function childByTag(parent: SElement | null, tag: string): SElement | null {
  if (!parent) return null;
  for (const c of parent.childNodes) if (c.nodeType === 1 && (c as SElement).localName === tag) return c as SElement;
  return null;
}

function walk(el: SElement, fn: (el: SElement) => void): void {
  for (const c of el.childNodes) {
    if (c.nodeType === 1) {
      fn(c as SElement);
      walk(c as SElement, fn);
    }
  }
}

type Sel = { tag: string | null; attrs: [string, string | undefined][] };
const selCache = new Map<string, Sel>();
function parseSelector(sel: string): Sel {
  let q = selCache.get(sel);
  if (q) return q;
  const tagMatch = sel.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
  const tag = tagMatch ? tagMatch[1]!.toLowerCase() : null;
  const attrs: [string, string | undefined][] = [];
  const re = /\[([a-zA-Z0-9_-]+)(?:="([^"]*)")?\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sel))) attrs.push([m[1]!, m[2]]);
  q = { tag, attrs };
  selCache.set(sel, q);
  return q;
}
function selMatch(el: SElement, q: Sel): boolean {
  if (q.tag && el.localName !== q.tag) return false;
  for (const [name, val] of q.attrs) {
    if (!el.attrs.has(name)) return false;
    if (val !== undefined && el.attrs.get(name) !== val) return false;
  }
  return true;
}

export function shimFromLinkedom(lDoc: any): SDocument {
  const doc = new SDocument();
  const conv = (ln: any): SNode | null => {
    const nt = ln.nodeType;
    if (nt === 1) {
      const el = new SElement(String(ln.tagName).toLowerCase());
      const names: string[] = ln.getAttributeNames ? ln.getAttributeNames() : [];
      for (const n of names) el.attrs.set(n, ln.getAttribute(n) ?? "");
      for (const child of ln.childNodes) {
        const c = conv(child);
        if (c) el.appendChild(c);
      }
      return el;
    }
    if (nt === 3) return new SText(ln.data ?? ln.textContent ?? "");
    if (nt === 8) return new SComment(ln.data ?? "");
    return null;
  };
  const html = conv(lDoc.documentElement);
  if (html) doc.appendChild(html);
  return doc;
}
