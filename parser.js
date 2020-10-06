class Parser {
  constructor(raw) {
    this.raw = raw;
    this.index = 0;
  }

  next(string) {
    if (this.raw.slice(this.index, this.index + string.length) === string) {
      this.index += string.length;
      return true;
    }
    return false;
  }

  current() {
    return this.raw[this.index];
  }

  readUntil(string) {
    let str = "";
    let ch = "";

    while (((ch = this.current()), ch !== string)) {
      if (this.index >= this.raw.length) {
        return str;
      }
      str += ch;
      this.index++;
    }
    return str;
  }

  readUntilP(pattern) {
    let str = "";
    let ch = "";

    while (((ch = this.current()), !pattern.test(ch))) {
      if (this.index >= this.raw.length) {
        return str;
      }
      str += ch;
      this.index++;
    }
    return str;
  }

  skip() {
    while (this.current() <= " ") {
      this.index += 1;
    }
  }
}

module.exports = Parser;
