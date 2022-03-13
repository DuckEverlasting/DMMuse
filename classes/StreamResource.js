require("dotenv").config();
const Resource = require("./Resource");

module.exports = class StreamResource extends Resource {
  constructor(uri) {
    super(uri);
  }

  getResource() {
    return this.uri;
  }
}
