const parse = require("../index");

describe("parse", () => {
  it("<div><p></p></div>", () => {
    expect(parse("<div></div>")).toMatchSnapshot();
  });

  it("match text <div><p>Hello World</p></div>", () => {
    expect(parse("<div><p>Hello World</p></div>")).toMatchSnapshot();
  });

  it('match text <div class="class"><p>Hello World</p></div>', () => {
    expect(
      parse('<div class="class"><p>Hello World</p></div>')
    ).toMatchSnapshot("attribute");
  });

  it("match self closing", () => {
    expect(parse("<video />")).toMatchSnapshot("self closing");
  });

  it("match self closing in children", () => {
    expect(
      parse(`<div data-toggle="true" class="hello">
    <p>Hello World</p>
    <video src="self closing" />
  </div>
  `)
    ).toMatchSnapshot();
  });

  it("pure text should be valid", () => {
    expect(parse(`Hello World`)).toMatchSnapshot();
  });

  it("should throw error when block name is not valid", () => {
    expect(() => {
      parse("{#popo }");
    }).toThrow("popo is not a valid block name");
  });

  it("should throw error when block is open", () => {
    expect(() => {
      parse("{#if ");
    }).toThrow("Block is opened, missing }");
  });

  it("should match if block", () => {
    expect(parse("{#if var}{/if}")).toMatchSnapshot();
  });

  it("should throw error when as is not added in each block", () => {
    expect(() => {
      parse("{#each variable_name }{/each}");
    }).toThrow("expected `as`");
  });

  it("should match each block", () => {
    expect(parse("{#each arr as item}{/each}")).toMatchSnapshot();
    expect(parse("{#each arr as item, i}{/each}")).toMatchSnapshot();
  });

  it("should throw error when block mismatch", () => {
    expect(() => {
      parse("{#each variable_name as item}{/if}");
    }).toThrow("Block mismatch!");
  });

  it("should parse {a}", () => {
    expect(parse("{a}")).toMatchSnapshot();
  });
});
