module.exports = class Resource {

  constructor(uri) {
    this.uri = uri;
  }

  getResource() {
    throw new Error('Method "getResource" not implemented')
  }
}
