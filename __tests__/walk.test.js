const parse = require("../index");
const walk = require("../walk");

describe("walk", () => {
  it("should walk in order (enter)", () => {
    const ast = parse(`<div><span></span></div>`).html;
    const result = [];
    walk(ast, {
      enter: (node) => result.push(node.type + node.name + node.data),
      exit: () => {},
    });
    expect(result).toEqual(["Elementdiv", "Elementspan"]);
  });

  it("should walk in order (exit)", () => {
    const ast = parse(`<div><span>123</span></div>`).html;
    const result = [];
    walk(ast, {
      enter: () => {},
      exit: (node) => result.push(node.type + node.name + node.data),
    });
    expect(result).toEqual([
      "Text123",
      "Elementspan",
      "Elementdiv",
      "Fragment",
    ]);
  });
});
