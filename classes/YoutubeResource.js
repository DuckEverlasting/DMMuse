const Resource = require("./Resource");
const ytdl = require("ytdl-core");

module.exports = class YoutubeResource extends Resource {
  constructor(uri) {
    super(uri);
  }

  getResource() {
    return ytdl(
      this.uri, {
        quality: "highestaudio",
        highWaterMark: 1024 * 1024 * 10,
      }
    )
  }
}