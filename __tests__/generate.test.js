const generate = require("../generate");

describe("Genretate", () => {
  it("should generate code (pure element)", () => {
    const code = generate("<div><p></p></div>");
    expect(code).toMatchSnapshot();
  });

  it("should generate code (element with text)", () => {
    const code = generate("<div><p>345</p><p>12345</p></div>");
    expect(code).toMatchSnapshot();
  });

  it("should generate code attr", () => {
    const code = generate('<div><p role="status">345</p><p>12345</p></div>');
    expect(code).toMatchSnapshot();
  });
});
