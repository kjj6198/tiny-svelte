const fs = require("fs");
const Component = require("./compile/Component");
const parse = require("./index");

const content = fs.readFileSync("./App.svelte");
fs.writeFileSync(
  "./main.js",
  new Component(parse(content.toString())).generate()
);
