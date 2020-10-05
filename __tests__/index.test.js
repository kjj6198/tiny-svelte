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
});
