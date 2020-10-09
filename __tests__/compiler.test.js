const parse = require("../index");
const Component = require("../compile/Component");

describe("Component", () => {
  it("should compile", () => {
    const ast = parse(`<script>console.log()</script><p>html</p>`);
    const component = new Component(ast);
    expect(component.fragment.children[0].type).toBe("Element");
    expect(component.fragment.children[0].children[0].type).toBe("Text");
  });

  it("should compile js", () => {
    const ast = parse(`<script>console.log()</script><p>html</p>`);
    const component = new Component(ast);
    expect(component.generate()).toMatchSnapshot("");
  });

  it("should compile js (nested)", () => {
    const ast = parse(
      `<script>console.log(); let a = 1</script><p>html <span>123</span></p>`
    );
    const component = new Component(ast);
    expect(component.generate()).toMatchSnapshot();
  });

  it("should compile js (mustachetag)", () => {
    const ast = parse(
      `<script>console.log(); let a = 1</script><p>html <span>123 {a}</span></p>`
    );
    const component = new Component(ast);
    expect(component.generate()).toMatchSnapshot();
  });

  it("should compile js (attr)", () => {
    const ast = parse(
      `<script>console.log(); let a = 1</script><p role="status">html</p>`
    );
    const component = new Component(ast);
    expect(component.generate()).toMatchSnapshot();
  });
});
