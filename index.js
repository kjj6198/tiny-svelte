const Parser = require("./parser");
const Node = require("./Node");
const acorn = require("acorn");

function parse(content) {
  const parser = new Parser(content);
  const root = new Node();
  root.start = parser.index;
  root.type = "Fragment";
  let js = "";
  const stack = [];

  function parseJS() {
    parser.skip();
    if (parser.next("<script>")) {
      js += parser.readUntil("<");
    }

    parser.next("</script>");
  }

  parseJS();

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
    const text = parser.readUntilP(/\<|\{/);
    node.data = text;
    node.end = parser.index;
    node.type = "Text";
    return node;
  }

  function attr_value() {
    // TODO: handle `:`, {expression}
    // <div data-modal={} />
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
      node.selfClosing = true;
      node.end = parser.index;
    }

    return node;
  }

  function block_open() {
    // if, each
    const keywords = ["if", "each"];
    const node = new Node();
    node.start = parser.index;

    const blockName = parser.readUntil(" ");
    if (!keywords.includes(blockName)) {
      throw new Error(blockName + " is not a valid block name");
    }
    const blockType = keywords[keywords.findIndex((val) => val === blockName)];
    node.type = blockType[0].toUpperCase() + blockType.slice(1) + "Block"; // IfBlock, EachBlock
    stack.push(node);
    if (node.type === "IfBlock") {
      parser.skip();
      const condition = parser.readUntil("}");
      node.data = {
        condition: condition.trim(),
      };
    }

    if (node.type === "EachBlock") {
      parser.skip();
      const variable = parser.readUntil(" ");
      parser.skip();

      if (parser.next("as")) {
        parser.skip();
        const local = parser.readUntilP(/\,|\}/);
        if (parser.next(",")) {
          parser.skip();
          const index = parser.readUntil("}");
          node.data = {
            variable: variable,
            local,
            index,
          };
        } else {
          node.data = {
            variable: variable,
            local,
          };
        }
      } else {
        throw new Error("expected `as`");
      }
    }

    if (parser.next("}")) {
      return node;
    } else {
      throw new Error("Block is opened, missing }");
    }
  }

  function block_close() {
    const current_node = stack.pop();
    const blockName = current_node.type; // IfBlock EachBlock
    const name = parser.readUntil("}");
    // if tag match
    if (blockName.replace("Block", "").toLowerCase() !== name) {
      throw new Error("Block mismatch!");
    }
    parser.next("}");
    current_node.end = parser.index;
  }

  function parse_mustache() {
    const tag = {
      type: "MustacheTag",
      start: parser.index,
      end: parser.index,
    };

    parser.skip();
    const name = parser.readUntil("}");
    parser.next("}");
    return {
      ...tag,
      name: name.trim(),
      end: parser.index,
    };
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
      } else if (parser.next("{#")) {
        current_node.children.push(block_open());
      } else if (parser.next("{/")) {
        block_close();
        parseHTML();
      } else if (parser.next("{")) {
        current_node.children.push(parse_mustache());
      } else {
        current_node.children.push(text());
      }
    }
    parser.skip();
    // 上面：把所有 parse 邏輯處理完
    root.end = parser.index;
    return root;
  }

  return {
    html: parseHTML(),
    js: acorn.parse(js),
  };
}

module.exports = parse;
