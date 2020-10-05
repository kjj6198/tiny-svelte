class Node {
  constructor() {
    this.start = 0;
    this.end = 0;
    this.type = "";
    this.name = "";
    this.selfClosing = false;
    this.data = "";
    this.attrs = [];
    this.children = [];
  }
}

class Parser {
  constructor(raw) {
    this.raw = raw;
    this.index = 0;
  }

  next(string) {
    if (this.raw.slice(this.index, this.index + string.length) === string) {
      this.index += string.length;
      return true;
    }
    return false;
  }

  current() {
    return this.raw[this.index];
  }

  readUntil(string) {
    let str = "";
    let ch = "";

    while (((ch = this.current()), ch !== string)) {
      if (this.index >= this.raw.length) {
        return str;
      }
      str += ch;
      this.index++;
    }
    return str;
  }

  readUntilP(pattern) {
    let str = "";
    let ch = "";

    while (((ch = this.current()), !pattern.test(ch))) {
      str += ch;
      this.index++;
    }
    return str;
  }

  skip() {
    while (this.current() <= " ") {
      this.index += 1;
    }
  }
}

function parse(content) {
  const parser = new Parser(content);
  const root = new Node();
  root.start = parser.index;
  root.type = "Fragment";

  const stack = [];

  function tag_name_close() {
    const tagName = parser.readUntil(">");
    const current_node = stack.pop();
    current_node.end = parser.index;

    parser.next(">");

    if (current_node.name !== tagName) {
      throw new Error("Tag name mismatch!!");
    }
  }

  function text() {
    const node = new Node();
    node.start = parser.index;
    const text = parser.readUntil("<");
    node.data = text;
    node.end = parser.index;
    node.type = "Text";
    return node;
  }

  function attr_value() {
    // TODO: handle `:`, {expression}
    if (parser.next("=")) {
      if (parser.next('"')) {
        const value = parser.readUntil('"');
        parser.next('"');
        return {
          value,
          type: "Attribute",
        };
      }
    }
  }

  function attrs(node) {
    // key=value
    parser.skip();
    let ch = "";
    let key = "";

    if (parser.current() === "/" || parser.current() === ">") {
      return;
    }

    while (((ch = parser.current()), ch !== ">" && ch !== "=" && ch !== ":")) {
      // TODO: for now, only support `=`
      key += ch;
      parser.index += 1;
    }

    node.attrs.push({
      name: key,
      ...attr_value(),
    });

    parser.skip();

    if (parser.current() !== ">" && parser.current() !== "/") {
      attrs(node);
    }
  }

  function tag_name() {
    const node = new Node();
    node.start = parser.index - 1;
    const tagName = parser.readUntilP(/ |\>/);
    node.name = tagName;
    node.type = "Element";

    attrs(node);
    if (parser.next(">")) {
      stack.push(node);
      return node;
    } else if (parser.next("/>")) {
      stack.pop();
      node.selfClosing = true;
      node.end = parser.index;
    }

    return node;
  }

  function parseHTML() {
    let ch = parser.current();
    parser.skip();
    while (((ch = parser.current()), ch)) {
      let current_node = null;
      if (stack.length === 0) {
        current_node = root;
      } else {
        current_node = stack.slice(-1)[0];
      }

      if (parser.next("</")) {
        tag_name_close();
        parseHTML();
      } else if (parser.next("<")) {
        current_node.children.push(tag_name());
      } else {
        current_node.children.push(text());
      }
    }
    parser.skip();
    // 上面：把所有 parse 邏輯處理完
    root.end = parser.index;
    return root;
  }

  return parseHTML();
}
