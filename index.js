const Parser = require("./parser");
const Node = require("./Node");

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
        console.log(parser.next('"'));
        return {
          value,
          type: "Attribute",
        };
      }
    }
  }

  function attrs(node) {
    parser.skip();

    if (parser.current() === ">" || parser.current() === "/") {
      return;
    }

    const attrName = parser.readUntil("=");
    console.log(attrName);
    node.attrs.push({
      key: attrName,
      ...attr_value(), // value: name
    });

    parser.skip();

    while (parser.current() !== ">" && parser.current() !== "/") {
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
    root.end = parser.index - 1;
    return root;
  }

  return parseHTML();
}

module.exports = parse;
