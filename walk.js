function walk(ast, { exit, enter }) {
  // Text, MustacheTag
  if (ast.children && ast.children.length === 0) {
    exit(ast);
  } else if (ast.type === "Text" || ast.type === "MustacheTag") {
    exit(ast);
  } else {
    // Element
    ast.children.forEach((node) => {
      node.parent = ast;
      enter(node);
      walk(node, { exit, enter });
    });
    exit(ast);
  }
}

module.exports = walk;
