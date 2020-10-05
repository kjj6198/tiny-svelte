class Node {
  constructor() {
    this.start = 0;
    this.end = 0;
    this.type = "";
    this.name = "";
    this.selfClosing = false;
    this.data = "";
    this.attrs = [];
    this.children = [];
  }
}

module.exports = Node;
