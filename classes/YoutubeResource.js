const { createAudioResource } = require('@discordjs/voice');
const Resource = require("./Resource");
const ytdl = require("ytdl-core");

module.exports = class YoutubeResource extends Resource {
  constructor(uri) {
    super(uri);
    this.resource = createAudioResource(
        ytdl(this.uri, {
            quality: "highestaudio",
            highWaterMark: 1048576 * 32,
        }),
        { inlineVolume: true }
    );
  }

  getResource() {
    return this.resource;
  }
}
