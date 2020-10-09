const parse = require("../index");

describe("parse", () => {
  it("<div><p></p></div>", () => {
    expect(parse("<div></div>").html).toMatchSnapshot();
  });

  it("match text <div><p>Hello World</p></div>", () => {
    expect(parse("<div><p>Hello World</p></div>").html).toMatchSnapshot();
  });

  it('match text <div class="class"><p>Hello World</p></div>', () => {
    expect(
      parse('<div class="class"><p>Hello World</p></div>').html
    ).toMatchSnapshot("attribute");
  });

  it("match self closing", () => {
    expect(parse("<video />").html).toMatchSnapshot("self closing");
  });

  it("match self closing in children", () => {
    expect(
      parse(`<div data-toggle="true" class="hello">
    <p>Hello World</p>
    <video src="self closing" />
  </div>
  `).html
    ).toMatchSnapshot();
  });

  it("pure text should be valid", () => {
    expect(parse(`Hello World`).html).toMatchSnapshot();
  });

  it("should throw error when block name is not valid", () => {
    expect(() => {
      parse("{#popo }").html;
    }).toThrow("popo is not a valid block name");
  });

  it("should throw error when block is open", () => {
    expect(() => {
      parse("{#if ").html;
    }).toThrow("Block is opened, missing }");
  });

  it("should match if block", () => {
    expect(parse("{#if var}{/if}").html).toMatchSnapshot();
  });

  it("should throw error when as is not added in each block", () => {
    expect(() => {
      parse("{#each variable_name }{/each}").html;
    }).toThrow("expected `as`");
  });

  it("should match each block", () => {
    expect(parse("{#each arr as item}{/each}").html).toMatchSnapshot();
    expect(parse("{#each arr as item, i}{/each}").html).toMatchSnapshot();
  });

  it("should throw error when block mismatch", () => {
    expect(() => {
      parse("{#each variable_name as item}{/if}").html;
    }).toThrow("Block mismatch!");
  });

  it("should parse {a}", () => {
    expect(parse("{a}").html).toMatchSnapshot();
  });

  it("should parse inside <script></script>", () => {
    expect(parse("<script>console.log('a')").js).toMatchSnapshot();
  });
});
