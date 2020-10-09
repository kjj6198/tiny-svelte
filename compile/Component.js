const { x, b, print } = require("code-red");
const { walk } = require("estree-walker");
class Block {
  constructor() {
    this.variables = [];
    this.chunks = {
      mount: [],
      create: [],
      // update
      // intro
    };
  }
}

class Node {
  constructor(component, parent, info) {
    this.type = info.type;
    this.parent = parent;
    this.component = component;
  }
}
// div p, section
class Element extends Node {
  constructor(component, parent, info) {
    super(component, parent, info);
    this.type = "Element";
    this.name = info.name;
    this.attributes = info.attrs;
    this.children = map_children(component, parent, info.children);
    if (component.used_var.has(this.name)) {
      component.used_var.set(this.name, component.used_var.get(this.name) + 1);
    } else {
      component.used_var.set(this.name, 1);
    }
    this.id = this.name + component.used_var.get(this.name);
  }

  // render code
  render(block, parent) {
    block.variables.push(b`let ${this.id};`);
    block.chunks.create.push(
      b`${this.id} = document.createElement('${this.name}')`
    );
    if (this.attributes.length > 0) {
      this.attributes.forEach((attr) => {
        block.chunks.mount.push(
          b`${this.id}.setAttribute("${attr.name}", "${attr.value}");`
        );
      });
    }

    block.chunks.mount.push(
      b`append(${this.id}, ${parent ? parent.id : "fragment"})`
    );
    this.children.forEach((child) => child.render(block, this));
  }
}
// {}
class MustacheTag extends Node {
  constructor(component, parent, info) {
    super(component, parent, info);
    this.name = info.name;
  }

  render(block, parent) {
    if (!this.component.var_lookup.has(this.name)) {
      throw new Error(this.name + " is not defined");
    }

    block.chunks.mount.push(
      b`append(text(${this.name}), ${parent ? parent.id : "fragment"})`
    );
  }
}

class Text extends Node {
  constructor(component, parent, info) {
    super(component, parent, info);
    this.type = "Text";
    this.data = info.data;
    if (component.used_var.has("t")) {
      component.used_var.set("t", component.used_var.get("t") + 1);
    } else {
      component.used_var.set("t", 1);
    }
    this.id = "t" + component.used_var.get("t");
  }

  render(block, parent) {
    block.variables.push(b`let ${this.id};`);
    block.chunks.create.push(
      b`${this.id} = document.createTextNode("${this.data}")`
    );
    const target = parent ? parent.id : "fragment";
    block.chunks.mount.push(b`append(${this.id}, ${target})`);
  }
}

function map_children(component, parent, children) {
  return children.map((child) => {
    let node = null;
    if (child.type === "Element") {
      node = new Element(component, parent, child);
    } else if (child.type === "Text") {
      node = new Text(component, parent, child);
    } else if (child.type === "MustacheTag") {
      node = new MustacheTag(component, parent, child);
    }

    return node;
  });
}

class Fragment extends Node {
  constructor(component, info) {
    super(component, null, info);
    this.children = map_children(component, this, info.children);
  }

  render(block, parent) {
    this.children.forEach((child) => {
      child.render(block, parent);
    });
  }
}

class Component {
  constructor(ast) {
    // parse(content) js , html
    this.block = new Block();
    this.used_var = new Map();
    this.ast = ast;
    this.fragment = new Fragment(this, ast.html);
    this.vars = [];
    this.var_lookup = new Map();
  }

  walk_js() {
    walk(this.ast.js, {
      enter: (node) => {
        if (node.type === "VariableDeclaration") {
          node.declarations.forEach((declaration) => {
            const node = {
              type: "Variable",
              writable: declaration.kind === "const",
              id: declaration.id,
              init: declaration.init,
              kind: declaration.kind,
            };
            this.vars.push(node);
            this.var_lookup.set(declaration.id.name, node);
          });
        }
      },
    });
  }

  generate() {
    let body = [];
    this.walk_js();
    this.fragment.render(this.block, null);
    const global_vars = this.vars.map((va) => {
      return b`let ${va.id.name} = ${va.init}`;
    });

    body.push(x`
      function instance() {
        ${this.ast.js.body.filter((n) => n.type !== "VariableDeclaration")}
      }
    `);
    body.push(x`
      function create_fragment() {
        ${this.block.variables}

        return {
          create: () => {
            ${this.block.chunks.create}
          },
          mount: () => {
            ${this.block.chunks.mount}
          }
        }
      }
    `);

    return (
      print(b`${global_vars}`).code +
      "\n" +
      print({
        type: "Program",
        body: body,
      }).code
    );
  }
}

module.exports = Component;
