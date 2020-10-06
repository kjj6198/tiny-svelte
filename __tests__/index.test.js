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

  it("should throw exception if block name is invalid", () => {
    expect(() => {
      parse("{# invalid }");
    }).toThrow("invalid is not valid block");
  });

  it("should throw exception if block is open", () => {
    expect(() => {
      parse("{# if ");
    }).toThrow("Block is opened!");
  });

  it("should parse if block", () => {
    expect(parse("{# if name}{/if}")).toMatchSnapshot();
  });

  it("should parse if block with children", () => {
    expect(
      parse(`{# if name}
<p>Hello World</p>
<p>Hello World</p>
    {/if}`)
    ).toMatchSnapshot();
  });

  it("should parse each block without index", () => {
    expect(
      parse(`{#each name as n}
<p>Hello World {n}</p>
{/each}`)
    ).toMatchSnapshot();
  });

  it("should parse each block with index", () => {
    // with space
    expect(parse("{#each name as n, i}{/each}")).toMatchSnapshot();
    // with no space
    expect(parse("{#each name as n,i}{/each}")).toMatchSnapshot();
  });
});
