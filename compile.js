const fs = require("fs");
const generate = require("./generate");
const code = fs.readFileSync("./Component.svelte");

fs.writeFileSync("./component.js", generate(code.toString()));
