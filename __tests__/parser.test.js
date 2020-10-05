const Parser = require("../parser");

describe("Parser", () => {
  it("should match string and increase index", () => {
    const parser = new Parser("Hello World");
    expect(parser.next("H")).toBe(true);
    expect(parser.index).toBe(1);
  });

  it("should match multiple string", () => {
    const parser = new Parser("Hello World");
    expect(parser.next("Hello")).toBe(true);
    expect(parser.index).toBe(5);
  });

  it("should return current char", () => {
    const parser = new Parser("Helxo World");
    expect(parser.next("He")).toBe(true);
    expect(parser.current()).toBe("l");
  });

  it("should skip space or \t", () => {
    const parser = new Parser(`
      <div>
      </div>
    `);
    parser.skip();
    expect(parser.next("<")).toBe(true);
    expect(parser.index).toBe(8);
  });

  it("should read char until match", () => {
    const parser = new Parser(`<div>`);
    parser.next("<");
    expect(parser.readUntil(">")).toBe("div");
  });

  it("should return match string when no match", () => {
    const parser = new Parser(`div`);
    expect(parser.readUntil(">")).toBe("div");
  });

  it("should readUntil pattern match", () => {
    const parser = new Parser(`<div class="name">`);
    parser.next("<");
    expect(parser.readUntilP(/ |\>/)).toBe("div");
    expect(parser.current()).toBe(" ");
  });
});
